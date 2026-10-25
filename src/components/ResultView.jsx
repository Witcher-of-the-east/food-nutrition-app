import React from 'react';

export default function ResultView({ item, portion, setPortion, onClose, onConfirm, alternatives = [], onPickAlternative, dishList = [], onManualDish }) {
  if (!item) return null;

  // Dynamic calculations scaling per portion multiplier
  const calculatedCalories = Math.round((item.calories || 0) * portion);
  const calculatedProtein = ((item.protein || item.protein_g || 0) * portion).toFixed(1);
  const calculatedCarbs = ((item.carbs || item.carbs_g || 0) * portion).toFixed(1);
  const calculatedFat = ((item.fat || item.fat_g || 0) * portion).toFixed(1);
  const [typed, setTyped] = React.useState('');

  return (
    <div className="screen">
      {/* Top Banner Image Overlay */}
      <div className="result-image-header">
        <button className="close-overlay-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        <img
          src={item.image || '/images/burger.png'}
          className="result-hero-img"
          alt={item.dish || 'Scanned Food'}
        />
      </div>

      {/* Main Results Sheet */}
      <div className="result-sheet">
        <h3 style={{ margin: '0 0 15px 0', textTransform: 'capitalize' }}>
          {item.dish || 'Scanned Dish'}
        </h3>
                {alternatives.length > 1 && (
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#A0AEC0' }}>
              Not right? Pick the correct dish:
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {alternatives.map((a) => (
                <button
                  key={a.dish}
                  onClick={() => onPickAlternative(a.dish)}
                  style={{
                    padding: '6px 10px', borderRadius: 14, cursor: 'pointer', fontSize: 12,
                    border: a.dish === item.dish ? '2px solid #FF6B00' : '1px solid #E2E8F0',
                    background: a.dish === item.dish ? '#FFF5F0' : '#FFF',
                  }}
                >
                  {a.dish.replace(/_/g, ' ')} {Math.round(a.confidence * 100)}%
                </button>
              ))}
            </div>
          </div>
        )}
                <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: '#A0AEC0' }}>
            None of these? Type the dish name:
          </span>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <input
              list="dish-options"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="e.g. dal tadka"
              style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
            />
            <datalist id="dish-options">
              {dishList.map((d) => (
                <option key={d} value={d.replace(/_/g, ' ')} />
              ))}
            </datalist>
            <button
              onClick={() => { if (typed.trim()) { onManualDish(typed); setTyped(''); } }}
              style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#FF6B00', color: '#FFF', cursor: 'pointer', fontSize: 13 }}
            >
              Use
            </button>
          </div>
          {item.calories === 0 && (
            <p style={{ fontSize: 11, color: '#A0AEC0', margin: '6px 0 0 0' }}>
              Nutrition for this dish is not in our database yet. Your photo is still saved to help improve the model.
            </p>
          )}
        </div>
        {/* Dynamic Macros Calculation Grid */}
        <div className="macro-grid">
          <div className="macro-card">
            <span className="macro-val">{calculatedCalories}</span>
            <span className="macro-lbl">CALORIES</span>
          </div>
          <div className="macro-card">
            <span className="macro-val">{calculatedProtein}g</span>
            <span className="macro-lbl">PROTEIN</span>
          </div>
          <div className="macro-card">
            <span className="macro-val">{calculatedCarbs}g</span>
            <span className="macro-lbl">CARBS</span>
          </div>
          <div className="macro-card">
            <span className="macro-val">{calculatedFat}g</span>
            <span className="macro-lbl">FAT</span>
          </div>
        </div>

        {/* Serving Portion Selector Controls */}
        <div className="portion-row">
          <div>
            <label style={{ fontSize: 11, color: '#A0AEC0', display: 'block', marginBottom: 4 }}>
              Serving
            </label>
            <input
              type="number"
              min="0.5"
              max="5.0"
              step="0.5"
              value={portion}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPortion(isNaN(val) || val <= 0 ? 1 : val);
              }}
              className="portion-input"
            />
          </div>
          <select className="portion-select" defaultValue="standard">
            <option value="standard">
              {item.dish ? `${item.dish} (${item.serving_g || 100}g)` : 'serving (100g)'}
            </option>
          </select>
        </div>

        {/* Interactive Portion Multiplier Slider */}
        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.5"
          value={portion}
          onChange={(e) => setPortion(parseFloat(e.target.value))}
          className="portion-slider"
        />

        {/* Health / Nutrition Insight Note */}
        <div className="nutrition-grade-box">
          <div className="grade-badge">{item.grade || 'B'}</div>
          <p style={{ fontSize: 11, color: '#4A5568', margin: 0, marginLeft: 10 }}>
            {item.gradeText ||
              'Balanced meal choice based on official nutrition database standard values.'}
          </p>
        </div>

        {/* Final Confirmation Action */}
        <button className="confirm-btn" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}