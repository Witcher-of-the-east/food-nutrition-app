import React, { useRef, useState } from 'react';

const MODES = { Plate: 0.82, Bowl: 0.62, Glass: 0.38 };

export default function CameraView({ isScanning, onClose, onCapture }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [mode, setMode] = useState('Plate');
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [cropError, setCropError] = useState('');

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPendingFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCropError('');
    }
    e.target.value = '';
  };

  const confirmCrop = async () => {
    if (!pendingFile || !previewUrl) return;
    try {
      const image = new Image();
      image.src = previewUrl;
      await image.decode();
      const side = Math.min(image.naturalWidth, image.naturalHeight) * MODES[mode];
      const sx = (image.naturalWidth - side) / 2;
      const sy = (image.naturalHeight - side) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, sx, sy, side, side, 0, 0, 720, 720);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
      if (!blob) throw new Error('Could not crop this image.');
      const cropped = new File([blob], pendingFile.name.replace(/\.[^.]+$/, '') + '-crop.jpg', { type: 'image/jpeg' });
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      setPendingFile(null);
      onCapture(cropped);
    } catch (err) {
      setCropError(err.message || 'Could not crop image. Please try another photo.');
    }
  };

  const cancelCrop = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setPendingFile(null);
    setCropError('');
  };

  return (
    <div className="camera-screen">
      <div className="camera-header">
        <button className="close-camera-btn" onClick={onClose} aria-label="Close camera">×</button>
        <span style={{ color: '#FFF', fontSize: 18 }}>⚡</span>
      </div>

      {pendingFile ? (
        <div className="crop-panel">
          <h3>Crop your food photo</h3>
          <p>Center the food inside the guide. The cropped image is what gets analysed.</p>
          <div className={`crop-preview crop-${mode.toLowerCase()}`}>
            <img src={previewUrl} alt="Photo to crop" />
            <span className="crop-guide" />
          </div>
          <div className="guide-mode-row">
            {Object.keys(MODES).map(name => <button key={name} className={mode === name ? 'guide-mode active' : 'guide-mode'} onClick={() => setMode(name)}>{name}</button>)}
          </div>
          {cropError && <p className="crop-error" role="alert">{cropError}</p>}
          <div className="crop-actions">
            <button className="crop-cancel" onClick={cancelCrop}>Retake</button>
            <button className="crop-confirm" onClick={confirmCrop}>Use cropped photo</button>
          </div>
        </div>
      ) : (
        <>
          <div className="camera-mode-picker">
            <span>Frame your food</span>
            <div className="guide-mode-row">
              {Object.keys(MODES).map(name => <button key={name} className={mode === name ? 'guide-mode active' : 'guide-mode'} onClick={() => setMode(name)}>{name}</button>)}
            </div>
          </div>
          <div className="viewfinder-center">
            <div className={`camera-guide camera-guide-${mode.toLowerCase()}`}>
              <span>{mode === 'Plate' ? 'Fit the whole plate inside' : mode === 'Bowl' ? 'Fit the bowl inside' : 'Fit the glass inside'}</span>
            </div>
          </div>
          <input type="file" accept="image/*" ref={galleryInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
          <input type="file" accept="image/*" capture={facingMode} ref={cameraInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
          {isScanning ? <div className="scanning-toast"><div className="spinner" /><span style={{ marginLeft: 10, fontSize: 13, color: '#4A5568' }}>Scanning in progress…</span></div> : (
            <div className="camera-controls">
              <button className="gallery-btn" onClick={() => galleryInputRef.current?.click()} title="Choose from Gallery">🖼️</button>
              <button className="shutter-btn" onClick={() => cameraInputRef.current?.click()} title="Take Photo"><div className="shutter-inner" /></button>
              <button className="gallery-btn" onClick={() => setFacingMode(v => v === 'environment' ? 'user' : 'environment')} title="Switch camera">🔄</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
