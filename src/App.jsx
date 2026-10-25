import React, { useState, useEffect } from 'react';
import HomeDashboard from './components/HomeDashboard';
import LogModal from './components/LogModal';
import FoodList from './components/FoodList';
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import MealSummary from './components/MealSummary';
import ActivityScreen from './components/ActivityScreen';

import { initialFoodItems } from './data/mockData';
import {
  predictDish,
  getNutrition,
  sendFeedback,
  getDishes,
  getTodayMeals,
} from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedMealCategory, setSelectedMealCategory] = useState('Breakfast');
  const [portion, setPortion] = useState(1.0);
  const [scannedItem, setScannedItem] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [top3, setTop3] = useState([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [pickedSource, setPickedSource] = useState('top3');
  const [dishList, setDishList] = useState([]);
  const [today, setToday] = useState(null);
  const [activity, setActivity] = useState(null);
  const [toast, setToast] = useState('');

  // Load today's meals on mount
  useEffect(() => {
    getTodayMeals()
      .then(setToday)
      .catch(() => {}); // backend may not be available yet
  }, []);

  // Load dish list for manual entry suggestions
  useEffect(() => {
    getDishes()
      .then(setDishList)
      .catch(() => {});
  }, []);

  // Show a brief toast notification
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // User took / picked a photo – send to FastAPI POST /predict
  const handleCapture = async (file) => {
    setIsScanning(true);
    const objectUrl = URL.createObjectURL(file);
    setPhotoUrl(objectUrl);
    setPhotoFile(file);
    try {
      const result = await predictDish(file);
      // result expected: { top3: [{dish, confidence}], dish, ... }
      const predictions = result.top3 || [];
      setTop3(predictions);
      const bestDish = predictions[0]?.dish || result.dish || 'unknown';
      try {
        const n = await getNutrition(bestDish);
        setScannedItem({ ...n, image: objectUrl });
      } catch {
        setScannedItem({
          dish: bestDish,
          calories: 0, protein_g: 0, carbs_g: 0,
          fat_g: 0, serving_g: 100, image: objectUrl,
        });
      }
      setCurrentScreen('result');
    } catch (e) {
      showToast('Could not analyse photo. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // User chose one of the top-3 alternatives
  const handlePickAlternative = async (dish) => {
    setPickedSource('top3');
    try {
      const n = await getNutrition(dish);
      setScannedItem({ ...n, image: photoUrl });
    } catch {
      setScannedItem({
        dish, calories: 0, protein_g: 0, carbs_g: 0,
        fat_g: 0, serving_g: 100, image: photoUrl,
      });
    }
  };

  // User manually typed a dish name
  const handleManualDish = async (typedName) => {
    const dish = typedName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!dish) return;
    setPickedSource('manual');
    try {
      const n = await getNutrition(dish);
      setScannedItem({ ...n, image: photoUrl });
    } catch {
      setScannedItem({
        dish, calories: 0, protein_g: 0, carbs_g: 0,
        fat_g: 0, serving_g: 100, image: photoUrl,
      });
    }
  };

  // Confirm: save photo + correct dish for training feedback
  const handleConfirmResult = () => {
    if (photoFile && scannedItem) {
      sendFeedback(
        photoFile, scannedItem.dish,
        top3[0]?.dish, top3[0]?.confidence, pickedSource
      ).catch((e) => console.log('Feedback not saved:', e));
      setPhotoFile(null); // avoid double-saving
    }
    setCurrentScreen('food_list_scanned');
  };

  // Go home and refresh today's data
  const handleGoHome = () => {
    getTodayMeals().then(setToday).catch(() => {});
    setCurrentScreen('home');
  };

  return (
    <div className="app-container">
      {toast && <div className="toast-message" role="status">{toast}</div>}

      {currentScreen === 'home' && (
        <HomeDashboard
          onOpenLog={() => setCurrentScreen('log_modal')}
          onOpenActivity={() => setCurrentScreen('activity')}
          onOpenCamera={() => setCurrentScreen('camera')}
          today={today}
          activity={activity}
        />
      )}

      {currentScreen === 'log_modal' && (
        <LogModal
          onClose={() => setCurrentScreen('home')}
          onSelectCategory={(cat) => {
            setSelectedMealCategory(cat);
            setCurrentScreen('food_list');
          }}
        />
      )}

      {(currentScreen === 'food_list' || currentScreen === 'food_list_scanned') && (
        <FoodList
          category={selectedMealCategory}
          foodItems={initialFoodItems}
          scannedItem={scannedItem}
          portion={portion}
          onBack={() => setCurrentScreen('home')}
          onStartCamera={() => setCurrentScreen('camera')}
          onSubmitMeal={() => setCurrentScreen('meal_summary')}
        />
      )}

      {currentScreen === 'camera' && (
        <CameraView
          isScanning={isScanning}
          onClose={() => setCurrentScreen('food_list')}
          onCapture={handleCapture}
        />
      )}

      {currentScreen === 'result' && (
        <ResultView
          item={scannedItem}
          portion={portion}
          setPortion={setPortion}
          alternatives={top3}
          onPickAlternative={handlePickAlternative}
          dishList={dishList}
          onManualDish={handleManualDish}
          onClose={() => setCurrentScreen('camera')}
          onConfirm={handleConfirmResult}
        />
      )}

      {currentScreen === 'activity' && (
        <ActivityScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'meal_summary' && (
        <MealSummary
          category={selectedMealCategory}
          today={today}
          onHome={handleGoHome}
        />
      )}
    </div>
  );
}

}