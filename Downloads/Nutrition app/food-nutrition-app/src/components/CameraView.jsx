import React, { useRef, useState, useEffect } from 'react';

export default function CameraView({ isScanning, onClose, onCapture }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const reqId = useRef(0);
  const [facingMode, setFacingMode] = useState('environment'); // back / front
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  // Live camera shuru karo (browser permission maangega)
  const startCamera = async (mode) => {
    const id = ++reqId.current;
    stopCamera();
    setCameraError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        'Live camera needs a secure (https) link. Use the gallery button, or tap the shutter to open the phone camera.'
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode } },
        audio: false,
      });
      if (id !== reqId.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraOn(true);
    } catch (err) {
      setCameraError(
        'Camera blocked or not found (' + err.name + '). Allow camera in the browser, or use the gallery button.'
      );
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      reqId.current++;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gallery ya native camera se photo aayi
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) onCapture(file);
  };

  // Shutter: live camera se photo kheencho (nahi chal raha to native camera/file box)
  const handleShutter = () => {
    const video = videoRef.current;
    if (cameraOn && video && video.videoWidth) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCapture(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
          }
        },
        'image/jpeg',
        0.9
      );
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleFlip = () => {
    const mode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(mode);
    startCamera(mode);
  };

  return (
    <div className="camera-screen">
      <div className="camera-header">
        <button className="close-camera-btn" onClick={onClose} aria-label="Close camera">
          ×
        </button>
        <span style={{ color: '#FFF', fontSize: 18 }}>⚡</span>
      </div>

      <div
        className="viewfinder-center"
        style={{ minHeight: 0, overflow: 'hidden', position: 'relative' }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: cameraOn ? 'block' : 'none',
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
          }}
        />
        {!cameraOn && (
          <div style={{ color: '#CBD5E0', textAlign: 'center', padding: 24, fontSize: 13 }}>
            {cameraError || 'Starting camera...'}
          </div>
        )}
        {isScanning && (
          <div className="scan-box" style={{ position: 'absolute', top: 30, bottom: 30, left: 30, right: 30 }} />
        )}
      </div>

      {/* Hidden inputs: gallery aur native camera (backup) */}
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
          <button
            className="gallery-btn"
            onClick={() => galleryInputRef.current?.click()}
            title="Choose from Gallery"
          >
            🖼️
          </button>
          <button className="shutter-btn" onClick={handleShutter} title="Take Photo">
            <div className="shutter-inner" />
          </button>
          <button
            className="gallery-btn"
            onClick={handleFlip}
            title={`Switch Camera (Currently: ${facingMode === 'environment' ? 'Back' : 'Front'})`}
          >
            🔄
          </button>
        </div>
      )}
    </div>
  );
}