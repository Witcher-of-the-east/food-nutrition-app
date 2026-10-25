import React, { useEffect, useRef, useState } from 'react';
import { Icons } from '../assets/icons';
import { getRecentMeals, searchDishes } from '../services/api';

const prettyName = (name = '') => String(name).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function FoodList({
  category, foodItems = [], scannedItem, portion, onBack, onStartCamera,
  onSubmitMeal, onSelectDish, onAddRecent
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    setVoiceSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    getRecentMeals(10).then(setRecent).catch(() => setRecent([]));
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!query.trim()) {
      setResults([]);
      setSearchError('');
      setSearching(false);
      return;
    }
    setSearching(true);
    timer.current = setTimeout(async () => {
      try {
        const hits = await searchDishes(query.trim());
        setResults(hits);
        setSearchError('');
      } catch (err) {
        // Keep the screen usable if the backend endpoint has not been deployed yet.
        const q = query.toLowerCase().replace(/\s+/g, '_');
        const local = foodItems.filter(x => String(x.name || x.dish).toLowerCase().includes(q));
        setResults(local.map(x => ({ dish: x.dish || x.name, score: 100 })));
        setSearchError(local.length ? '' : 'Search service is not available yet. Please try again later.');
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer.current);
  }, [query, foodItems]);

  const startVoice = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return;
    const recognition = new Speech();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.onresult = event => setQuery(event.results[0][0].transcript);
    recognition.onerror = () => setSearchError('Voice search could not hear you. Please try again.');
    recognition.start();
  };

  const selectRecent = item => {
    if (onAddRecent) onAddRecent(item);
    else onSelectDish?.(item.dish || item.name);
  };

  return (
    <div className="screen">
      <div className="header-bar food-list-header">
        <button className="icon-btn" onClick={onBack} aria-label="Go back"><Icons.ChevronLeft /></button>
        <span style={{ fontWeight: 'bold', fontSize: 18 }}>Food</span>
        <span aria-hidden="true">•••</span>
      </div>

      <div className="food-list-content">
        <label className="sr-only" htmlFor="food-search">Search food</label>
        <div className="search-control">
          <input id="food-search" type="search" value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search foods (try “panir”)"
            className="search-input" autoComplete="off" />
          {voiceSupported && <button className="mic-btn" onClick={startVoice} aria-label="Search by voice" title="Voice search">🎙️</button>}
        </div>
        <div className="action-btn-row">
          {!voiceSupported && <span className="voice-unavailable">Voice search isn't supported in this browser.</span>}
          <button className="primary-action-btn" onClick={onStartCamera}>
            <Icons.Scan /><span style={{ marginLeft: 6 }}>Scan with AI</span>
          </button>
        </div>

        {query.trim() && <section aria-live="polite">
          <h5 className="section-heading">Search results</h5>
          {searching && <p className="food-list-sub">Searching…</p>}
          {!searching && results.map((item, index) => {
            const dish = item.dish || item.name || item.food;
            if (!dish) return null;
            return <button className="food-list-item food-result-button" key={`${dish}-${index}`}
              onClick={() => onSelectDish?.(dish)}>
              <span className="food-thumb food-emoji">🍽️</span>
              <span className="food-result-name">{prettyName(dish)}</span>
              <span className="add-btn">＋</span>
            </button>;
          })}
          {!searching && !results.length && <p className="food-list-sub">{searchError || 'No matching dishes found.'}</p>}
          {searchError && results.length > 0 && <p className="food-list-sub">{searchError}</p>}
        </section>}

        {scannedItem && (
          <>
            <h5 className="section-heading">AI scan</h5>
            <div className="food-list-item scanned-active">
              <img src={scannedItem.image || '/images/burger.png'} className="food-thumb" alt={prettyName(scannedItem.dish)} />
              <div style={{ flex: 1, marginLeft: 10 }}>
                <b>{prettyName(scannedItem.dish)}</b>
                <p className="food-list-sub">{Math.round((scannedItem.calories || 0) * portion)} kcal · {Math.round((scannedItem.serving_g || 100) * portion)} g</p>
              </div>
              <Icons.Check />
            </div>
          </>
        )}

        {!query.trim() && <>
          <h5 className="section-heading">Recently had</h5>
          {recent.length === 0 && <p className="food-list-sub">Your saved meals will appear here after you log food.</p>}
          {recent.map((item, index) => <button className="food-list-item food-result-button" key={item.id || `${item.dish}-${index}`} onClick={() => selectRecent(item)}>
            <span className="food-thumb food-emoji">🍽️</span>
            <span className="recent-copy">
              <b>{prettyName(item.dish || item.name)}</b>
              <span className="food-list-sub">{Math.round(item.calories || 0)} kcal · {item.servings || 1} serving</span>
            </span>
            <span className="add-btn">＋</span>
          </button>)}
        </>}
      </div>

      {scannedItem && <div className="sticky-footer">
        <button className="submit-btn" onClick={onSubmitMeal}>Add to {category.toLowerCase()} <span className="badge">1</span></button>
      </div>}
    </div>
  );
}
