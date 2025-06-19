import React, { useEffect, useState } from 'react';

const DeviceOrientationDisplay: React.FC = () => {
  const [orientation, setOrientation] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  }>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha ?? null,
        beta: event.beta ?? null,
        gamma: event.gamma ?? null,
      });
    };

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // For iOS 13+ devices
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            } else {
              console.warn('Permission to access device orientation denied.');
            }
          })
          .catch(console.error);
      } else {
        // Non-iOS or older Android
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } else {
      console.warn('Device orientation not supported.');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial', backgroundColor: '#f5f5f5' }}>
      <h2>Device Orientation</h2>
      <p><strong>Alpha (Z-axis rotation):</strong> {orientation.alpha?.toFixed(2) ?? 'N/A'}</p>
      <p><strong>Beta (X-axis tilt):</strong> {orientation.beta?.toFixed(2) ?? 'N/A'}</p>
      <p><strong>Gamma (Y-axis tilt):</strong> {orientation.gamma?.toFixed(2) ?? 'N/A'}</p>
    </div>
  );
};

export default DeviceOrientationDisplay;
