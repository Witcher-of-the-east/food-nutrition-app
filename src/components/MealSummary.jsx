import React from 'react';
import { Icons } from '../assets/icons';

const prettyName = (d) => d.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function MealSummary({ category, today, onHome }) {
  const categoryMeals = (today?.meals || []).filter(
    (m) => (m.category || 'Snack') === category
  );
  const totalCalories = Math.round(today?.by_category?.[category] || 0);

  return (
    <div className="screen" style={{ backgroundColor: '#EDF2F7' }}>
      <div className="meal-summary-header">
        <button className="icon-btn" onClick={onHome}>
          <Icons.ChevronLeft />
        </button>
        <h2 style={{ margin: '10px 0 0 0' }}>{category}</h2>
        <span style={{ fontSize: 12, color: '#718096' }}>Recommended portion: 450-500 kcal</span>
        <div className="summary-ring">
          <Icons.Lightning />
          <span style={{ fontSize: 24, fontWeight: 'bold' }}>{totalCalories}</span>
          <span style={{ fontSize: 10, color: '#A0AEC0' }}>/ 500 kcal</span>
        </div>
      </div>

      <div className="content-body">
        <h5 className="section-heading">Food</h5>
        {categoryMeals.length === 0 && (
          <p className="food-list-sub">Nothing logged yet</p>
        )}
        {categoryMeals.map((m, i) => (
          <div className="food-list-item" key={i}>
            <div
              className="food-thumb"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#F7FAFC', fontSize: 22,
              }}
            >
              🍽️
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <b>{prettyName(m.dish)}</b>
              <p className="food-list-sub">
                {Math.round(m.calories)}kcal - {m.servings} serving
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}