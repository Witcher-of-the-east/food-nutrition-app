# 🥗 AI Nutrition Tracking App — Food Photo Module (Week 1)

An interactive React web application integrated with a FastAPI machine learning backend that predicts Indian dishes from photos, calculates portion-adjusted nutritional macros, and logs daily meals[cite: 1, 2].

---

## 📌 Project Overview & Team Roles

* **Goal (14 October):** Deliver a working app prototype and dataset capable of predicting dish classes, adjusting portion macros dynamically, and logging meal data to SQLite.
* **Team Structure:**
  * **Build Team:**
    * **Abhijeet Singh (Frontend):** React/JS application, UI components, portion slider, camera/gallery capture, and API integration contract.
    * **Varun (Backend API):** FastAPI server, Hugging Face pretrained model pipeline, database logging, and CSV lookup.
  * **Data Team:**
    * **Achintiya:** Dish selection (30 target dishes), standard serving weights, and IFCT/USDA nutrition source verification.
    * **Yuvraj:** CSV database maintenance, Google Drive folder structure, photo dataset collection & test split management.
  * **Team Lead:** Abdullah

---

## 🛠️ App Architecture & Tech Stack

* **Frontend:** React.js (Vite), CSS3 Custom Modules, Custom Inline SVG Assets.
* **Backend:** FastAPI (Python), PyTorch, Hugging Face `transformers` pipeline, SQLite.
* **Data Layer:** `nutrition_v1.csv` (IFCT 2017 / USDA dataset).

---

## 🚀 Quick Start Guide (Frontend Setup)

### 1. Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)

### 2. Installation
Clone the repository and install dependencies:

```bash
# Clone team repository
git clone [https://github.com/YOUR_TEAM_NAME/food-nutrition-app.git](https://github.com/YOUR_TEAM_NAME/food-nutrition-app.git)
cd food-nutrition-app

# Install npm dependencies
npm install

## Week 2 frontend work (Abhijeet)

Implemented in this branch/work package:
- Fixed the screen layout so the main content area scrolls while the bottom navigation stays in place.
- Added screen, button, modal, progress-ring and notification animations, with reduced-motion support.
- Connected the food search UI to `GET /search?q=...` with a 250 ms debounce and graceful handling if the endpoint is not available.
- Added browser voice search (`en-IN`) where `SpeechRecognition` is supported.
- Replaced mock recent-food rows with `GET /meals/recent?limit=10`; selecting a recent meal attempts to log it again.
- Added Plate, Bowl and Glass camera guides and a crop-confirmation step. The confirmed cropped image is sent to the existing prediction API.
- Added the Activity navigation screen and Home's burned-calorie display, using `GET /activity/today` when the backend endpoint is available.
- Added a stable browser-generated `X-User-Id` header to frontend API requests.
- Replaced the capture-flow browser alerts with an in-app status toast.

### Backend integration contract

The frontend now expects these Week 2 endpoints to be available from the backend:
- `GET /search?q=<query>` returning `{ "results": [{ "dish": "paneer", "score": 92 }] }`
- `GET /meals/recent?limit=10` returning an array of meal records (or `{ "meals": [...] }`)
- `GET /activity/today` returning fields such as `steps`, `kcal_burned` (or `calories_burned`) and `active_minutes`

These endpoints are part of the Week 2 integration plan and may not exist in the current backend branch yet. The UI shows a helpful message if Activity data is unavailable. Fuzzy search requires the backend to implement the planned alias matching; the frontend debounce alone does not provide fuzzy matching.
