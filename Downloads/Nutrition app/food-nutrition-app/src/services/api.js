// Local machine testing URL
const BASE_URL = 'http://localhost:8000';

/**
 * 1. POST /predict
 * Sends photo file as multipart/form-data
 */
export async function predictDish(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Predict API error: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * 2. GET /nutrition/{dish}
 */
export async function getNutrition(dishName) {
  const response = await fetch(`${BASE_URL}/nutrition/${encodeURIComponent(dishName)}`);

  if (!response.ok) {
    throw new Error(`Nutrition API error: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * 3. POST /meals
 */
export async function saveMeal(dishName, servings, calories) {
  const response = await fetch(`${BASE_URL}/meals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dish: dishName,
      servings: servings,
      calories: calories,
    }),
  });

  if (!response.ok) {
    throw new Error(`Save Meal API error: ${response.statusText}`);
  }

  return await response.json();
}