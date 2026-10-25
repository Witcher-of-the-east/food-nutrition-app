// A stable per-browser ID keeps requests ready for the backend's user-scoped API.
const USER_ID_KEY = 'food-nutrition-user-id';
let userId = localStorage.getItem(USER_ID_KEY);
if (!userId) {
  userId = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(USER_ID_KEY, userId);
}
const userHeaders = () => ({ 'X-User-Id': userId });

// Laptop pe localhost, phone pe laptop ka IP apne aap use hoga
const BASE_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '' : `http://${window.location.hostname}:8000`);

// 1. POST /predict
export async function predictDish(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${BASE_URL}/predict`, { method: 'POST', body: formData, headers: userHeaders() });
  if (!response.ok) throw new Error(`Predict API error: ${response.statusText}`);
  return await response.json();
}

// 2. GET /nutrition/{dish}
export async function getNutrition(dishName) {
  const response = await fetch(`${BASE_URL}/nutrition/${encodeURIComponent(dishName)}`, { headers: userHeaders() });
  if (!response.ok) throw new Error(`Nutrition API error: ${response.statusText}`);
  return await response.json();
}

// 3. POST /meals  (extra = { category, protein_g, carbs_g, fat_g })
export async function saveMeal(dishName, servings, calories, extra = {}) {
  const response = await fetch(`${BASE_URL}/meals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...userHeaders() },
    body: JSON.stringify({ dish: dishName, servings, calories, ...extra }),
  });
  if (!response.ok) throw new Error(`Save Meal API error: ${response.statusText}`);
  return await response.json();
}

// 4. GET /meals/today
export async function getTodayMeals() {
  const response = await fetch(`${BASE_URL}/meals/today`, { headers: userHeaders() });
  if (!response.ok) throw new Error(`Today meals API error: ${response.statusText}`);
  return await response.json();
}

// 5. GET /dishes  (typing ke suggestions)
export async function getDishes() {
  const response = await fetch(`${BASE_URL}/dishes`, { headers: userHeaders() });
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
  const response = await fetch(`${BASE_URL}/feedback`, { method: 'POST', body: formData, headers: userHeaders() });
  if (!response.ok) throw new Error(`Feedback API error: ${response.statusText}`);
  return await response.json();
}

// Week 2: fuzzy search and real recent meals. These endpoints are supplied by the backend.
export async function searchDishes(query) {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
    headers: userHeaders(),
  });
  if (!response.ok) throw new Error(`Search API error: ${response.status}`);
  const data = await response.json();
  return data.results || data.dishes || [];
}

export async function getRecentMeals(limit = 10) {
  const response = await fetch(`${BASE_URL}/meals/recent?limit=${limit}`, {
    headers: userHeaders(),
  });
  if (!response.ok) throw new Error(`Recent meals API error: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : (data.meals || data.results || []);
}

export async function getActivityToday() {
  const response = await fetch(`${BASE_URL}/activity/today`, { headers: userHeaders() });
  if (!response.ok) throw new Error(`Activity API error: ${response.status}`);
  return await response.json();
}
