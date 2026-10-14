import React from 'react';

export default function LogModal({ onClose, onSelectCategory }) {
  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        <div className="modal-header">
          <span style={{ fontWeight: 'bold', fontSize: 18 }}>Log</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="tab-row">
          <button className="tab-btn active">🥗 Meal</button>
          <button className="tab-btn">💧 Water</button>
          <button className="tab-btn">⚖️ Weight</button>
        </div>

        <div className="grid-2x2">
          <div className="grid-card" onClick={() => onSelectCategory('Breakfast')}>
            <span className="plus-icon">+</span>
            <b>Breakfast</b>
            <span style={{ fontSize: 11, color: '#E53E3E' }}>40kcal over</span>
          </div>
          <div className="grid-card" onClick={() => onSelectCategory('Snack')}>
            <span className="plus-icon">+</span>
            <b>Snack</b>
            <span style={{ fontSize: 11, color: '#38A169' }}>70kcal left</span>
          </div>
          <div className="grid-card" onClick={() => onSelectCategory('Lunch')}>
            <span className="plus-icon">+</span>
            <b>Lunch</b>
            <span style={{ fontSize: 11, color: '#718096' }}>350kcal left</span>
          </div>
          <div className="grid-card" onClick={() => onSelectCategory('Dinner')}>
            <span className="plus-icon">+</span>
            <b>Dinner</b>
            <span style={{ fontSize: 11, color: '#718096' }}>400kcal left</span>
          </div>
        </div>
      </div>
    </div>
  );
}