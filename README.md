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