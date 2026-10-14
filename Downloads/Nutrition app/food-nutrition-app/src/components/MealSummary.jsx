import React from 'react';
import { Icons } from '../assets/icons';

export default function MealSummary({ category, scannedItem, portion, onHome }) {
  const totalCalories = 150 + (scannedItem ? Math.round(scannedItem.calories * portion) : 0);

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
        {scannedItem && (
          <div className="food-list-item">
            <img src={scannedItem.image} className="food-thumb" alt={scannedItem.dish} />
            <div style={{ flex: 1, marginLeft: 10 }}>
              <b>{scannedItem.dish}</b>
              <p className="food-list-sub">
                {Math.round(scannedItem.calories * portion)}kcal - 1 burger
              </p>
            </div>
          </div>
        )}
        <div className="food-list-item">
          <img src="/images/hotdog.png" className="food-thumb" alt="Hotdog" />
          <div style={{ flex: 1, marginLeft: 10 }}>
            <b>Hotdog</b>
            <p className="food-list-sub">150kcal - 1 hotdog</p>
          </div>
        </div>
      </div>
    </div>
  );
}