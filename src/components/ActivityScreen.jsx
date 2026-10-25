import React, { useEffect, useState } from 'react';
import { getActivityToday } from '../services/api';
import { Icons } from '../assets/icons';

export default function ActivityScreen({ onBack }) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    getActivityToday().then(data => { if (active) setActivity(data); })
      .catch(() => { if (active) setUnavailable(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const steps = Math.max(0, Number(activity?.steps || 0));
  const burned = Math.round(Number(activity?.kcal_burned || activity?.calories_burned || 0));
  const minutes = Math.round(Number(activity?.active_minutes || 0));
  return <div className="screen activity-screen">
    <div className="header-bar activity-header">
      <button className="icon-btn" onClick={onBack} aria-label="Back to home"><Icons.ChevronLeft /></button>
      <h2>Activity</h2><span aria-hidden="true">📊</span>
    </div>
    <div className="content-body">
      <p className="activity-intro">Your movement summary for today</p>
      {loading ? <p>Loading activity…</p> : unavailable ? (
        <div className="activity-notice"><strong>Activity data isn't connected yet.</strong>
          <p>Steps and estimated calories burned will appear when the backend activity endpoints are available.</p></div>
      ) : <>
        <div className="activity-stat-card"><span>👟</span><div><strong>{steps.toLocaleString()}</strong><small>Steps · goal 8,000</small></div></div>
        <div className="activity-stat-card"><span>🔥</span><div><strong>{burned} kcal</strong><small>Estimated calories burned</small></div></div>
        <div className="activity-stat-card"><span>⏱️</span><div><strong>{minutes} min</strong><small>Active minutes</small></div></div>
        <p className="activity-footnote">Calories burned are estimates, not medical measurements.</p>
      </>}
    </div>
    <div className="bottom-nav"><button className="nav-icon-btn" onClick={onBack} aria-label="Home">📋</button><button className="nav-icon-btn active" aria-label="Activity">📊</button><span>Activity summary</span></div>
  </div>;
}
