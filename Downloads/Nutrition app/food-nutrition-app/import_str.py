import os

# List of required empty file paths
files_to_create = [
    "src/data/mockData.js",
    "src/assets/icons.jsx",
    "src/components/HomeDashboard.jsx",
    "src/components/LogModal.jsx",
    "src/components/FoodList.jsx",
    "src/components/CameraView.jsx",
    "src/components/ResultView.jsx",
    "src/components/MealSummary.jsx",
    "src/App.jsx",
    "src/index.css",
    "public/images/burger.png",
    "public/images/hotdog.png",
    "public/images/pizza.png",
    "public/images/donut.png",
    "public/images/cake.png",
    "public/images/popcorn.png",
    "public/images/cookies.png"
]

def create_empty_structure():
    for filepath in files_to_create:
        # Get directory name
        folder = os.path.dirname(filepath)
        
        # Create folder if it doesn't exist
        if folder:
            os.makedirs(folder, exist_ok=True)
        
        # Create empty file if it doesn't exist
        if os.path.exists(filepath):
            print(f"[SKIP] File already exists: {filepath}")
        else:
            with open(filepath, "w", encoding="utf-8") as f:
                pass  # Creates an empty file
            print(f"[CREATED] {filepath}")

if __name__ == "__main__":
    print("Creating empty project structure...")
    create_empty_structure()
    print("Done! All empty folders and files are ready.")