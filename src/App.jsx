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
  predictDish, getNutrition, saveMeal, getTodayMeals, getDishes, sendFeedback, getActivityToday,
} from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedMealCategory, setSelectedMealCategory] = useState('Breakfast');
  const [portion, setPortion] = useState(1.0);
  const [scannedItem, setScannedItem] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [top3, setTop3] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);      // asli photo (training ke liye)
  const [pickedSource, setPickedSource] = useState('top3'); // 'top3' ya 'manual'
  const [dishList, setDishList] = useState([]);          // typing suggestions
  const [today, setToday] = useState(null);
  const [activity, setActivity] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const refreshToday = async () => {
    try {
      setToday(await getTodayMeals());
    } catch (e) {
      console.log('Could not load today meals:', e);
    }
  };

  useEffect(() => {
    if (currentScreen === 'home') {
      refreshToday();
      getActivityToday().then(setActivity).catch(() => setActivity(null));
    }
  }, [currentScreen]);

  // App khulte hi dishes ki list lao
  useEffect(() => {
    getDishes().then(setDishList).catch(() => {});
  }, []);

  const handleCapture = async (file) => {
    setIsScanning(true);
    try {
      const data = await predictDish(file);
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      setPhotoFile(file);
      setPickedSource('top3');
      setTop3(data.top3);
      setPortion(1.0);

      let item = null;
      for (const guess of data.top3) {
        try {
          const n = await getNutrition(guess.dish);
          item = { ...n, image: url };
          break;
        } catch (e) {
          // CSV mein nahi hai, agla guess dekho
        }
      }
      if (!item && data.top3.length > 0) {
        item = {
          dish: data.top3[0].dish, calories: 0, protein_g: 0,
          carbs_g: 0, fat_g: 0, serving_g: 100, image: url,
        };
      }
      if (item) {
        setScannedItem(item);
        setCurrentScreen('result');
      } else {
        setToast('We could not identify that photo. Please try another image.');
      }
    } catch (err) {
      setToast('Could not connect to the food API. Check that the backend is running.');
    } finally {
      setIsScanning(false);
    }
  };

  // User ne top-3 mein se dish chuni
  const handlePickAlternative = async (dish) => {
    setPickedSource('top3');
    try {
      const n = await getNutrition(dish);
      setScannedItem({ ...n, image: photoUrl });
    } catch (e) {
      setScannedItem({
        dish, calories: 0, protein_g: 0, carbs_g: 0,
        fat_g: 0, serving_g: 100, image: photoUrl,
      });
    }
  };

  // User ne dish ka naam khud type kiya
  const handleManualDish = async (typedName) => {
    const dish = typedName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!dish) return;
    setPickedSource('manual');
    try {
      const n = await getNutrition(dish);
      setScannedItem({ ...n, image: photoUrl });
    } catch (e) {
      setScannedItem({
        dish, calories: 0, protein_g: 0, carbs_g: 0,
        fat_g: 0, serving_g: 100, image: photoUrl,
      });
    }
  };

  // Confirm: photo + sahi dish ka naam training data ke liye save karo
  const handleConfirmResult = () => {
    if (photoFile && scannedItem) {
      sendFeedback(
        photoFile, scannedItem.dish,
        top3[0]?.dish, top3[0]?.confidence, pickedSource
      ).catch((e) => console.log('Feedback not saved:', e));
      setPhotoFile(null); // dobara save na ho
    }
    setCurrentScreen('food_list_scanned');
  };

  const handleSubmitMeal = async () => {
    if (scannedItem && scannedItem.calories > 0) {
      try {
        await saveMeal(scannedItem.dish, portion, scannedItem.calories * portion, {
          category: selectedMealCategory,
          protein_g: (scannedItem.protein_g || 0) * portion,
          carbs_g: (scannedItem.carbs_g || 0) * portion,
          fat_g: (scannedItem.fat_g || 0) * portion,
        });
      } catch (e) {
        console.log('Save failed', e);
      }
    }
    await refreshToday();
    setCurrentScreen('meal_summary');
  };

  const handleSearchSelect = async (dish) => {
    await handleManualDish(dish);
    setCurrentScreen('result');
  };

  const handleAddRecent = async (item) => {
    const dish = item.dish || item.name;
    if (!dish) return;
    try {
      const n = await getNutrition(dish);
      const servings = item.servings || 1;
      await saveMeal(dish, servings, n.calories * servings, {
        category: selectedMealCategory,
        protein_g: (n.protein_g || 0) * servings,
        carbs_g: (n.carbs_g || 0) * servings,
        fat_g: (n.fat_g || 0) * servings,
      });
      await refreshToday();
      setToast(`${dish.replace(/_/g, ' ')} added to ${selectedMealCategory.toLowerCase()}.`);
    } catch (e) {
      setToast('Could not add that meal. Check the backend connection.');
    }
  };

  const handleGoHome = () => {
    setScannedItem(null);
    setTop3([]);
    setCurrentScreen('home');
  };

  return (
    <div className="app-container">
      {toast && <div className="toast-message" role="status">{toast}</div>}
      {currentScreen === 'home' && (
        <HomeDashboard onOpenLog={() => setCurrentScreen('log_modal')} onOpenActivity={() => setCurrentScreen('activity')} onOpenCamera={() => setCurrentScreen('camera')} today={today} activity={activity} />
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
          onSubmitMeal={handleSubmitMeal}
          onSelectDish={handleSearchSelect}
          onAddRecent={handleAddRecent}
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

      {currentScreen === 'activity' && <ActivityScreen onBack={() => setCurrentScreen('home')} />}

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