// Laptop pe localhost, phone pe laptop ka IP apne aap use hoga
const BASE_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '' : `http://${window.location.hostname}:8000`);
// 1. POST /predict
export async function predictDish(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${BASE_URL}/predict`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(`Predict API error: ${response.statusText}`);
  return await response.json();
}

// 2. GET /nutrition/{dish}
export async function getNutrition(dishName) {
  const response = await fetch(`${BASE_URL}/nutrition/${encodeURIComponent(dishName)}`);
  if (!response.ok) throw new Error(`Nutrition API error: ${response.statusText}`);
  return await response.json();
}

// 3. POST /meals  (extra = { category, protein_g, carbs_g, fat_g })
export async function saveMeal(dishName, servings, calories, extra = {}) {
  const response = await fetch(`${BASE_URL}/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dish: dishName, servings, calories, ...extra }),
  });
  if (!response.ok) throw new Error(`Save Meal API error: ${response.statusText}`);
  return await response.json();
}

// 4. GET /meals/today
export async function getTodayMeals() {
  const response = await fetch(`${BASE_URL}/meals/today`);
  if (!response.ok) throw new Error(`Today meals API error: ${response.statusText}`);
  return await response.json();
}
// 5. GET /dishes  (typing ke suggestions)
export async function getDishes() {
  const response = await fetch(`${BASE_URL}/dishes`);
  if (!response.ok) throw new Error(`Dishes API error: ${response.statusText}`);
  const data = await response.json();
  return data.dishes;
}

// 6. POST /feedback  (photo + confirm ki hui dish training ke liye save)
export async function sendFeedback(file, dish, predicted, confidence, source) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('dish', dish);
  formData.append('predicted', predicted || '');
  formData.append('confidence', confidence || 0);
  formData.append('source', source);
  const response = await fetch(`${BASE_URL}/feedback`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(`Feedback API error: ${response.statusText}`);
  return await response.json();
}