import React from 'react';
import { Icons } from '../assets/icons';

export default function HomeDashboard({ onOpenLog }) {
  return (
    <div className="screen">
      <div className="top-banner">
        <div className="header-bar">
          <span style={{ fontWeight: 'bold', fontSize: 18 }}>Home</span>
          <span style={{ cursor: 'pointer' }}>•••</span>
        </div>

        <div className="date-row">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
            <div key={idx} className={idx === 3 ? 'date-card active' : 'date-card'}>
              <span style={{ fontSize: 11, opacity: 0.8 }}>{day}</span>
              <span style={{ fontWeight: 'bold', fontSize: 14 }}>{19 + idx}</span>
            </div>
          ))}
        </div>

        <div className="calorie-ring-container">
          <div className="stat-col">
            <span className="stat-val">965</span>
            <span className="stat-lbl">EATEN</span>
          </div>
          <div className="ring-center">
            <Icons.Lightning />
            <span style={{ fontSize: 24, fontWeight: 'bold' }}>1658</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>KCAL LEFT</span>
          </div>
          <div className="stat-col">
            <span className="stat-val">108</span>
            <span className="stat-lbl">BURNED</span>
          </div>
        </div>

        <div className="macro-row">
          <div className="macro-pill">
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>150g left</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>CARB</span>
          </div>
          <div className="macro-pill">
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>118g left</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>PROTEIN</span>
          </div>
          <div className="macro-pill">
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>75g left</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>FAT</span>
          </div>
        </div>
      </div>

      <div className="content-body">
        <h4 style={{ margin: '15px 0 10px 0', color: '#2D3748' }}>Daily</h4>

        <div className="meal-card">
          <div>
            <span className="meal-title">Breakfast</span>
            <p className="meal-sub">Hotdog</p>
            <p style={{ fontWeight: 'bold', margin: 0 }}>
              150 <span style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 'normal' }}>/ 450 kcal</span>
            </p>
          </div>
          <img src="/images/hotdog.png" className="food-thumb" alt="Hotdog" />
        </div>

        <div className="meal-card">
          <div>
            <span className="meal-title">Lunch</span>
            <p className="meal-sub">Pizza</p>
            <p style={{ fontWeight: 'bold', margin: 0 }}>
              200 <span style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 'normal' }}>/ 500 kcal</span>
            </p>
          </div>
          <img src="/images/pizza.png" className="food-thumb" alt="Pizza" />
        </div>
      </div>

      <div className="bottom-nav">
        <span>📋</span>
        <span>📊</span>
        <button className="fab-btn" onClick={onOpenLog}>
          <Icons.Plus />
        </button>
        <span>📷</span>
        <span>👤</span>
      </div>
    </div>
  );
}