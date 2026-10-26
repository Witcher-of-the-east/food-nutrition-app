import React from 'react';
import { Icons } from '../assets/icons';

// Daily goals: abhi placeholder, baad mein user ki profile se aayenge
const GOALS = { calories: 2000, protein: 100, carbs: 250, fat: 65 };
const MEAL_TARGETS = { Breakfast: 450, Lunch: 600, Snack: 200, Dinner: 600 };
const MEAL_ORDER = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

const prettyName = (d) => d.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Is hafte ki dates (Monday se Sunday)
function getWeek() {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7; // Mon=0 ... Sun=6
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - mondayOffset + i);
    return { label, date: d.getDate(), isToday: i === mondayOffset };
  });
}

export default function HomeDashboard({ onOpenLog, onOpenActivity, onOpenCamera, today, activity }) {
  const meals = today?.meals || [];
  const eaten = Math.round(today?.total_calories || 0);
  const burned = Math.round(activity?.kcal_burned || activity?.calories_burned || 0);
  const left = Math.max(GOALS.calories - eaten + burned, 0);
  const carbsLeft = Math.max(Math.round(GOALS.carbs - (today?.total_carbs_g || 0)), 0);
  const proteinLeft = Math.max(Math.round(GOALS.protein - (today?.total_protein_g || 0)), 0);
  const fatLeft = Math.max(Math.round(GOALS.fat - (today?.total_fat_g || 0)), 0);

  return (
    <div className="screen">
      <div className="top-banner">
        <div className="header-bar">
          <span style={{ fontWeight: 'bold', fontSize: 18 }}>Home</span>
          <span style={{ cursor: 'pointer' }}>•••</span>
        </div>

        <div className="date-row">
          {getWeek().map((d, idx) => (
            <div key={idx} className={d.isToday ? 'date-card active' : 'date-card'}>
              <span style={{ fontSize: 11, opacity: 0.8 }}>{d.label}</span>
              <span style={{ fontWeight: 'bold', fontSize: 14 }}>{d.date}</span>
            </div>
          ))}
        </div>

        <div className="calorie-ring-container">
          <div className="stat-col">
            <span className="stat-val">{eaten}</span>
            <span className="stat-lbl">EATEN</span>
          </div>
          <div className="ring-center">
            <Icons.Lightning />
            <span style={{ fontSize: 24, fontWeight: 'bold' }}>{left}</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>KCAL LEFT</span>
          </div>
          <div className="stat-col">
            <span className="stat-val">{burned}</span>
            <span className="stat-lbl">BURNED</span>
          </div>
        </div>

        <div className="macro-row">
          <div className="macro-pill">
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>{carbsLeft}g left</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>CARB</span>
          </div>
          <div className="macro-pill">
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>{proteinLeft}g left</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>PROTEIN</span>
          </div>
          <div className="macro-pill">
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>{fatLeft}g left</span>
            <span style={{ fontSize: 10, color: '#A0AEC0' }}>FAT</span>
          </div>
        </div>
      </div>

      <div className="content-body">
        <h4 style={{ margin: '15px 0 10px 0', color: '#2D3748' }}>Daily</h4>

        {MEAL_ORDER.map((cat) => {
          const items = meals.filter((m) => (m.category || 'Snack') === cat);
          const last = items[items.length - 1];
          const kcal = Math.round(today?.by_category?.[cat] || 0);
          return (
            <div className="meal-card" key={cat}>
              <div>
                <span className="meal-title">{cat}</span>
                <p className="meal-sub">
                  {last
                    ? prettyName(last.dish) + (items.length > 1 ? ` +${items.length - 1} more` : '')
                    : 'Nothing logged yet'}
                </p>
                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  {kcal}{' '}
                  <span style={{ fontSize: 12, color: '#A0AEC0', fontWeight: 'normal' }}>
                    / {MEAL_TARGETS[cat]} kcal
                  </span>
                </p>
              </div>
              <div
                className="food-thumb"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#F7FAFC', fontSize: 22,
                }}
              >
                🍽️
              </div>
            </div>
          );
        })}
      </div>

      <div className="bottom-nav" aria-label="Main navigation">
        <button className="nav-icon-btn" aria-label="Home" title="Home">📋</button>
        <button className="nav-icon-btn" aria-label="Activity" title="Activity" onClick={onOpenActivity}>📊</button>
        <button className="fab-btn" onClick={onOpenLog} aria-label="Log a meal"><Icons.Plus /></button>
        <button className="nav-icon-btn" aria-label="Scan food" title="Scan food" onClick={onOpenCamera}>📷</button>
        <button className="nav-icon-btn" aria-label="Profile" title="Profile" onClick={() => window.dispatchEvent(new CustomEvent('food-app-profile'))}>👤</button>
      </div>
    </div>
  );
}

