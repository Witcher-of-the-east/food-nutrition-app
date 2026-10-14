from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Enable CORS for local React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return {
        "top3": [
            {"dish": "roti", "confidence": 0.85},
            {"dish": "paratha", "confidence": 0.10},
            {"dish": "puri", "confidence": 0.05}
        ]
    }

@app.get("/nutrition/{dish}")
async def get_nutrition(dish: str):
    return {
        "dish": dish,
        "serving_g": 40,
        "calories": 120,
        "protein_g": 3.5,
        "carbs_g": 22.0,
        "fat_g": 2.0
    }

@app.post("/meals")
async def save_meal(meal: dict):
    return {"saved": True}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)