import React, { useState } from 'react';
import HomeDashboard from './components/HomeDashboard';
import LogModal from './components/LogModal';
import FoodList from './components/FoodList';
import CameraView from './components/CameraView';
import ResultView from './components/ResultView';
import MealSummary from './components/MealSummary';

import { initialFoodItems, defaultScannedBurger } from './data/mockData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedMealCategory, setSelectedMealCategory] = useState('Breakfast');
  const [portion, setPortion] = useState(1.0);
  const [scannedItem, setScannedItem] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleCapture = () => {
    setIsScanning(true);
    // Simulate FastAPI POST /predict delay
    setTimeout(() => {
      setIsScanning(false);
      setScannedItem(defaultScannedBurger);
      setCurrentScreen('result');
    }, 1500);
  };

  const handleConfirmResult = () => {
    setCurrentScreen('food_list_scanned');
  };

  return (
    <div className="app-container">
      {currentScreen === 'home' && (
        <HomeDashboard onOpenLog={() => setCurrentScreen('log_modal')} />
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
          onClose={() => setCurrentScreen('camera')}
          onConfirm={handleConfirmResult}
        />
      )}

      {currentScreen === 'meal_summary' && (
        <MealSummary
          category={selectedMealCategory}
          scannedItem={scannedItem}
          portion={portion}
          onHome={() => setCurrentScreen('home')}
        />
      )}
    </div>
  );
}