import React, { useEffect, useRef, useState } from 'react';

const VideoWithOrientationMarker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [orientation, setOrientation] = useState<{ beta: number; gamma: number }>({
    beta: 0,
    gamma: 0,
  });

  const [markerSet, setMarkerSet] = useState(false);
  const [center, setCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Start the back camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    startCamera();
  }, []);

  // Orientation tracking
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;
      setOrientation({ beta, gamma });

      if (markerSet && markerRef.current && containerRef.current) {
        const container = containerRef.current;
        const { offsetWidth: width, offsetHeight: height } = container;

        const maxTilt = 30;
        const offsetX = (gamma / maxTilt) * (width / 4);
        const offsetY = (beta / maxTilt) * (height / 4);

        const newX = center.x + offsetX;
        const newY = center.y + offsetY;

        markerRef.current.style.transform = `translate(${newX}px, ${newY}px) translate(-50%, -50%)`;
      }
    };

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [markerSet, center]);

  // Click-to-place marker
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top - 500;

    // Set the exact center
    setCenter({ x, y });
    setMarkerSet(true);

    // Initial marker placement
    if (markerRef.current) {
      markerRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        ref={containerRef}
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          aspectRatio: '3/4',
          overflow: 'hidden',
          borderRadius: '12px',
          backgroundColor: 'black',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {markerSet && (
          <div
            ref={markerRef}
            style={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'red',
              border: '2px solid white',
              outline: '2px dashed yellow',
              top: 0,
              left: 0,
              transform: `translate(${center.x}px, ${center.y}px) translate(-50%, -50%)`,
              transition: 'transform 0.1s linear',
              pointerEvents: 'none',
              boxSizing: 'border-box',
            }}
          />
        )}
      </div>

      <div style={{ padding: '0.5rem', fontFamily: 'Arial', textAlign: 'left', width: '100%', maxWidth: '600px' }}>
        <p><strong>Beta (X tilt):</strong> {orientation.beta.toFixed(2)}</p>
        <p><strong>Gamma (Y tilt):</strong> {orientation.gamma.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default VideoWithOrientationMarker;
