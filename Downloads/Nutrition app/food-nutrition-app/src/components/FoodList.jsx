import React from 'react';
import { Icons } from '../assets/icons';

export default function FoodList({
  category,
  foodItems,
  scannedItem,
  portion,
  onBack,
  onStartCamera,
  onSubmitMeal
}) {
  return (
    <div className="screen">
      <div className="header-bar">
        <button className="icon-btn" onClick={onBack}>
          <Icons.ChevronLeft />
        </button>
        <span style={{ fontWeight: 'bold', fontSize: 18 }}>Food</span>
        <span>•••</span>
      </div>

      <div style={{ padding: '0 16px', flex: 1 }}>
        <input type="text" placeholder="Search in food database" className="search-input" />

        <div className="action-btn-row">
          <button className="secondary-action-btn">🎙️ Voice search</button>
          <button className="primary-action-btn" onClick={onStartCamera}>
            <Icons.Scan />
            <span style={{ marginLeft: 6 }}>Scan with AI</span>
          </button>
        </div>

        {scannedItem && (
          <>
            <h5 className="section-heading">AI scan</h5>
            <div className="food-list-item scanned-active">
              <img src={scannedItem.image} className="food-thumb" alt={scannedItem.dish} />
              <div style={{ flex: 1, marginLeft: 10 }}>
                <b>{scannedItem.dish}</b>
                <p className="food-list-sub">
                  {Math.round(scannedItem.calories * portion)}kcal - 1 burger ({Math.round(100 * portion)}g)
                </p>
              </div>
              <Icons.Check />
            </div>
          </>
        )}

        <h5 className="section-heading">Recently had</h5>
        {foodItems.map((item) => (
          <div key={item.id} className="food-list-item">
            <img src={item.image} className="food-thumb" alt={item.name} />
            <div style={{ flex: 1, marginLeft: 10 }}>
              <b>{item.name}</b>
              <p className="food-list-sub">{item.calories}kcal - {item.portionText}</p>
            </div>
            <button className="add-btn">+</button>
          </div>
        ))}
      </div>

      {scannedItem && (
        <div className="sticky-footer">
          <button className="submit-btn" onClick={onSubmitMeal}>
            Add to {category.toLowerCase()} <span className="badge">1</span>
          </button>
        </div>
      )}
    </div>
  );
}