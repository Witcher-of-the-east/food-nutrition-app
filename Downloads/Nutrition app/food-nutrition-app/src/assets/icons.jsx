import React from 'react';

export const Icons = {
  Lightning: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF8A00">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Camera: ({ color = '#FF6B00' }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Scan: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2">
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
    </svg>
  ),
  Plus: ({ color = '#FFFFFF' }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D3748" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#48BB78" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
};