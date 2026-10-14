import React, { useRef, useState } from 'react';

export default function CameraView({ isScanning, onClose, onCapture }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)

  // 1. Handle image selected from gallery or captured via native camera input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onCapture(file);
    }
  };

  // 2. Toggle between Front and Back camera facing mode
  const handleToggleFlip = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
  };

  return (
    <div className="camera-screen">
      <div className="camera-header">
        <button className="close-camera-btn" onClick={onClose} aria-label="Close camera">
          ×
        </button>
        <span style={{ color: '#FFF', fontSize: 18 }}>⚡</span>
      </div>

      <div className="viewfinder-center">
        {isScanning ? (
          <div className="scan-box">
            <img src="/images/burger.png" className="mock-camera-food" alt="Scanning preview" />
          </div>
        ) : (
          <img src="/images/burger.png" className="mock-camera-food" alt="Camera preview" />
        )}
      </div>

      {/* Hidden File Inputs for Gallery Picker and Direct Camera Capture */}
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        accept="image/*"
        capture={facingMode}
        ref={cameraInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {isScanning ? (
        <div className="scanning-toast">
          <div className="spinner" />
          <span style={{ marginLeft: 10, fontSize: 13, color: '#4A5568' }}>
            Scanning in progress...
          </span>
        </div>
      ) : (
        <div className="camera-controls">
          {/* 🖼️ Gallery Upload Button */}
          <button
            className="gallery-btn"
            onClick={() => galleryInputRef.current?.click()}
            title="Choose from Gallery"
          >
            🖼️
          </button>

          {/* 📸 Shutter Capture Button */}
          <button
            className="shutter-btn"
            onClick={() => cameraInputRef.current?.click()}
            title="Take Photo"
          >
            <div className="shutter-inner" />
          </button>

          {/* 🔄 Flip Camera Mode Button */}
          <button
            className="gallery-btn"
            onClick={handleToggleFlip}
            title={`Switch Camera (Currently: ${facingMode === 'environment' ? 'Back' : 'Front'})`}
          >
            🔄
          </button>
        </div>
      )}
    </div>
  );
}