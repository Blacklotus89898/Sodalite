import React, { useEffect, useRef, useState } from 'react';

export const AudioIntensity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [intensity, setIntensity] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(900); // Default width

  useEffect(() => {
    // Step 1: Request Microphone Access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Step 2: Set Up the Web Audio API
          const audioContext = new (window.AudioContext)();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          source.connect(analyser);
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          // Step 3: Visualize the Voice Intensity
          const canvas = canvasRef.current;
          if (canvas) {
            const canvasContext = canvas.getContext('2d');

            // Set canvas size based on the container's width
            const resizeCanvas = () => {
              const container = canvas.parentElement;
              if (container) {
                const newWidth = container.clientWidth;
                setContainerWidth(newWidth);
                canvas.width = newWidth;
                canvas.height = 200; // Keep the height fixed
              }
            };

            // Resize canvas on window resize
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas(); // Initial resize

            function draw() {
              requestAnimationFrame(draw);

              analyser.getByteFrequencyData(dataArray);

              if (canvasContext && canvas) {
                canvasContext.fillStyle = '#222'; // Dark background
                canvasContext.fillRect(0, 0, canvas.width, canvas.height);

                const barWidth = (canvas.width / bufferLength) * 2.5; // Adjust the bar width to the container size
                let barHeight;
                let x = 0;
                let sum = 0;

                for (let i = 0; i < bufferLength; i++) {
                  barHeight = dataArray[i];
                  sum += barHeight;
                  canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`; // Color intensity effect
                  canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                  x += barWidth + 1;
                }

                const avgIntensity = sum / bufferLength;
                setIntensity(avgIntensity);
              }
            }

            draw();
          }
        }).catch(err => {
          console.error('Error accessing the microphone:', err);
        });
    } else {
      console.error('MediaDevices API not supported in this browser.');
    }
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Voice Intensity Visualizer</h1>
      <canvas ref={canvasRef}></canvas>
      <div style={intensityStyle}>
        <p>Audio Intensity: {Math.round(intensity)}</p>
      </div>
    </div>
  );
};

// Dark theme container styling
const containerStyle = {
  padding: '20px',
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '8px',
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'center' as const,
  overflow: 'hidden' as const, // Prevent bars from exceeding the container width
};

// Styling for the header
const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
  color: '#fff',
};

// Styling for the intensity display
const intensityStyle = {
  marginTop: '10px',
  fontSize: '18px',
  color: '#ddd',
  backgroundColor: '#222',
  padding: '10px',
  borderRadius: '5px',
  display: 'inline-block' as const,
};
