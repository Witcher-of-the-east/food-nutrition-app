"""Food API: pretrained Hugging Face model + nutrition CSV + meal log.

Run:  uvicorn main:app --host 0.0.0.0 --port 8000
Docs: http://localhost:8000/docs
"""
import io
import os
import sqlite3
import datetime

import pandas as pd
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

# ---------- settings (change with environment variables if needed) ----------
MODEL_NAME =os.getenv("MODEL_NAME", "DrishtiSharma/finetuned-ViT-Indian-Food-Classification-v3")
PROCESSOR_NAME = PROCESSOR_NAME = os.getenv("PROCESSOR_NAME", "")
USE_FAKE = os.getenv("USE_FAKE", "0") == "1"   # set USE_FAKE=1 to skip the model
CSV_PATH = os.getenv("CSV_PATH", "nutrition_v1.csv")
DB_PATH = os.getenv("DB_PATH", "meals.db")
MAX_BYTES = 8 * 1024 * 1024                     # 8 MB upload limit

app = FastAPI(title="Food API")

# The React website runs on another port (5173), so the browser needs CORS permission.
# "*" is fine for development. Before the final demo/deployment, allow only our site.
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])
@app.middleware("http")
async def no_cache_for_pages(request, call_next):
    response = await call_next(request)
    if request.url.path == "/" or request.url.path.endswith(".html"):
        response.headers["Cache-Control"] = "no-cache"
    return response


def norm(x):
    """Make names comparable: 'Butter Naan' -> 'butter_naan'."""
    return str(x).strip().lower().replace(" ", "_").replace("-", "_")


# ---------- nutrition CSV ----------
df = pd.read_csv(CSV_PATH, keep_default_na=False, encoding="utf-8-sig")
df.columns = df.columns.str.strip()
rows = df.to_dict("records")
by_dish = {norm(r["dish_name"]): r for r in rows}
by_label = {norm(r["model_label"]): r for r in rows
            if str(r["model_label"]).strip().lower() != "none"}


def nutrition_dict(r):
    return {
        "dish": norm(r["dish_name"]),
        "serving": str(r["serving"]),
        "serving_g": float(r["serving_g"]),
        "calories": float(r["calories"]),
        "protein_g": float(r["protein_g"]),
        "carbs_g": float(r["carbs_g"]),
        "fat_g": float(r["fat_g"]),
        "fibre_g": float(r["fibre_g"]),
        "source": str(r["source"]),
    }


# ---------- model (downloaded once from Hugging Face, then runs locally) ----------
clf = None
if not USE_FAKE:
    try:
        from transformers import pipeline
        clf = pipeline("image-classification", model=MODEL_NAME,
                       image_processor=PROCESSOR_NAME or None)
        print("Model loaded:", MODEL_NAME)
    except Exception as e:
        print("Could not load the model, using fake predictions instead:", e)

FAKE_TOP3 = [
    {"dish": "roti", "confidence": 0.8, "in_csv": True},
    {"dish": "idli", "confidence": 0.1, "in_csv": True},
    {"dish": "plain_rice", "confidence": 0.05, "in_csv": True},
]


@app.get("/health")
def health():
    return {"ok": True, "model_loaded": clf is not None, "dishes_in_csv": len(rows)}


@app.get("/labels")
def labels():
    """Class list of the model. Send this list to the group on day 1."""
    if clf is None:
        return {"model": None, "count": 0, "labels": []}
    names = list(clf.model.config.id2label.values())
    return {"model": MODEL_NAME, "count": len(names), "labels": names}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "Image too large (max 8 MB)")
    try:
        img = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception:
        raise HTTPException(400, "Could not read the image (use JPG or PNG)")

    if clf is None:
        return {"source": "fake", "top3": FAKE_TOP3}

    out = clf(img, top_k=5)
    top3 = []
    for o in out:
        row = by_label.get(norm(o["label"]))
        if row is not None:
            dish, known = norm(row["dish_name"]), True
        else:
            dish, known = norm(o["label"]), False   # model knows it, CSV does not (yet)
        top3.append({"dish": dish,
                     "confidence": round(float(o["score"]), 3),
                     "in_csv": known})
    return {"source": MODEL_NAME, "top3": top3[:3]}


@app.get("/nutrition/{dish}")
def nutrition(dish: str):
    row = by_dish.get(norm(dish))
    if row is None:
        raise HTTPException(404, f"No nutrition data for '{dish}'")
    return nutrition_dict(row)


# ---------- meal log (SQLite) ----------
def init_db():
    con = sqlite3.connect(DB_PATH)
    con.execute("""CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dish TEXT, servings REAL, calories REAL, created_at TEXT)""")
    # purana database ho to naye columns jodo (error ka matlab column pehle se hai)
    for col in ["category TEXT", "protein_g REAL", "carbs_g REAL", "fat_g REAL"]:
        try:
            con.execute("ALTER TABLE meals ADD COLUMN " + col)
        except sqlite3.OperationalError:
            pass
    con.commit()
    con.close()


init_db()


class Meal(BaseModel):
    dish: str
    servings: float = 1.0
    calories: float
    category: str = "Snack"
    protein_g: float = 0
    carbs_g: float = 0
    fat_g: float = 0


@app.post("/meals")
def save_meal(meal: Meal):
    con = sqlite3.connect(DB_PATH)
    con.execute(
        "INSERT INTO meals (dish, servings, calories, category, protein_g, carbs_g, fat_g, created_at) "
        "VALUES (?,?,?,?,?,?,?,?)",
        (meal.dish, meal.servings, meal.calories, meal.category,
         meal.protein_g, meal.carbs_g, meal.fat_g,
         datetime.datetime.now().isoformat(timespec="seconds")))
    con.commit()
    con.close()
    return {"saved": True}


@app.get("/meals/today")
def meals_today():
    today = datetime.date.today().isoformat()
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    found = con.execute(
        "SELECT dish, servings, calories, category, protein_g, carbs_g, fat_g, created_at "
        "FROM meals WHERE created_at LIKE ? ORDER BY id", (today + "%",)).fetchall()
    con.close()
    meals = [dict(r) for r in found]

    def total(key):
        return round(sum((m[key] or 0) for m in meals), 1)

    by_category = {}
    for m in meals:
        cat = m["category"] or "Snack"
        by_category[cat] = round(by_category.get(cat, 0) + (m["calories"] or 0), 1)

    return {"meals": meals, "total_calories": total("calories"),
            "total_protein_g": total("protein_g"), "total_carbs_g": total("carbs_g"),
            "total_fat_g": total("fat_g"), "by_category": by_category}
# ---------- training data collection ----------
import re
import uuid

DATASET_DIR = os.getenv("DATASET_DIR", "dataset")
os.makedirs(DATASET_DIR, exist_ok=True)

_con = sqlite3.connect(DB_PATH)
_con.execute("""CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT, file_path TEXT, chosen_dish TEXT,
    predicted_dish TEXT, confidence REAL, source TEXT)""")
_con.commit()
_con.close()


def clean_dish(name):
    return re.sub(r"[^a-z0-9_]", "", norm(name))[:40]


@app.get("/dishes")
def dishes():
    return {"dishes": sorted(by_dish.keys())}


@app.post("/feedback")
async def feedback(file: UploadFile = File(...), dish: str = Form(...),
                   predicted: str = Form(""), confidence: float = Form(0.0),
                   source: str = Form("top3")):
    key = clean_dish(dish)
    if not key:
        raise HTTPException(400, "Dish name is empty")
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "Image too large (max 8 MB)")
    try:
        img = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception:
        raise HTTPException(400, "Could not read the image")
    img.thumbnail((1024, 1024))                 # chhota karo
    folder = os.path.join(DATASET_DIR, key)
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, uuid.uuid4().hex + ".jpg")
    img.save(path, "JPEG", quality=90)          # dobara save karne se GPS/EXIF hat jaata hai
    con = sqlite3.connect(DB_PATH)
    con.execute("INSERT INTO feedback (created_at, file_path, chosen_dish, "
                "predicted_dish, confidence, source) VALUES (?,?,?,?,?,?)",
                (datetime.datetime.now().isoformat(timespec="seconds"),
                 path, key, norm(predicted), confidence, source))
    con.commit()
    con.close()
    return {"saved": True, "dish": key, "in_csv": key in by_dish,
            "photos_for_dish": len(os.listdir(folder))}


@app.get("/dataset/stats")
def dataset_stats():
    counts = {}
    for d in sorted(os.listdir(DATASET_DIR)):
        if os.path.isdir(os.path.join(DATASET_DIR, d)):
            counts[d] = len(os.listdir(os.path.join(DATASET_DIR, d)))
    return {"photos_per_dish": counts, "total": sum(counts.values()),
            "not_in_csv": [d for d in counts if d not in by_dish]}
# ---------- frontend ko isi server se dikhao ----------
from fastapi.staticfiles import StaticFiles

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.isdir(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")