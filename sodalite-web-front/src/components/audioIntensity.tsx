import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../stores/hooks';

export const AudioIntensity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [intensity, setIntensity] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [showBars, setShowBars] = useState<boolean>(true);
  const [showRadial, setShowRadial] = useState<boolean>(false);
  const [showWaveform, setShowWaveform] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const timeArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { theme, chroma } = useTheme();

  const toggleAudio = async () => {
    if (isRunning) {
      stopAudio();
    } else {
      await startAudio();
    }
    setIsRunning(!isRunning);
  };

  const startAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    timeArrayRef.current = new Uint8Array(analyser.fftSize);

    source.connect(analyser);
    draw();
  };

  const stopAudio = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    streamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    setIntensity(0);
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current || !timeArrayRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    analyserRef.current.getByteTimeDomainData(timeArrayRef.current);

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (showBars) drawBars(ctx, dataArrayRef.current);
      if (showRadial) drawRadial(ctx, dataArrayRef.current);
      if (showWaveform) drawWaveform(ctx, timeArrayRef.current);

      const avgIntensity = dataArrayRef.current.reduce((sum, v) => sum + v, 0) / dataArrayRef.current.length;
      setIntensity(avgIntensity);
    }

    animationFrameRef.current = requestAnimationFrame(draw);
  };

  const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
    const { width, height } = ctx.canvas;
    const barWidth = (width / dataArray.length) * 2.5;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = dataArray[i];
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      ctx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }
  };

  const drawRadial = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array) => {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const angleStep = (2 * Math.PI) / dataArray.length;

    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i] / 255;
      const angle = i * angleStep;
      const outerRadius = radius + value * 50;

      const x1 = centerX + radius * Math.cos(angle);
      const y1 = centerY + radius * Math.sin(angle);
      const x2 = centerX + outerRadius * Math.cos(angle);
      const y2 = centerY + outerRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsl(${value * 360}, 100%, 50%)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, timeArray: Uint8Array) => {
    const { width, height } = ctx.canvas;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ffcc';
    const sliceWidth = width / timeArray.length;
    let x = 0;
    for (let i = 0; i < timeArray.length; i++) {
      const v = timeArray[i] / 255;
      const y = v * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
  };

  useEffect(() => {
    if (isRunning) {
      startAudio();
    } else {
      stopAudio();
    }
  }, [isRunning, showBars, showRadial, showWaveform]);

  const toggleVisualization = (type: string) => {
    if (type === "bars") setShowBars(prev => !prev);
    if (type === "radial") setShowRadial(prev => !prev);
    if (type === "waveform") setShowWaveform(prev => !prev);
  };

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 800;
        canvasRef.current.height = 300;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Audio Visualizer</h1>
      <canvas ref={canvasRef}></canvas>
      <div style={intensityStyle}>
        <p>Audio Intensity: {Math.round(intensity)}</p>
        <button
          style={isRunning ? buttonActiveStyle : buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = isRunning
              ? buttonActiveStyle.backgroundColor
              : buttonStyle.backgroundColor;
          }}
          // style={isRunning ? buttonActiveStyle : buttonStyle}
          onClick={toggleAudio}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>

        <label
          style={showBars ? labelActiveStyle : labelStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = showBars
              ? labelActiveStyle.backgroundColor
              : labelStyle.backgroundColor;
          }}
        >
          <input
            type="checkbox"
            checked={showBars}
            onChange={() => toggleVisualization('bars')}
            style={{ display: 'none' }}  // hide actual checkbox
          />
          Bars
        </label>

        <label
          style={showRadial ? labelActiveStyle : labelStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = showRadial
              ? labelActiveStyle.backgroundColor
              : labelStyle.backgroundColor;
          }}
        >
          <input
            type="checkbox"
            checked={showRadial}
            onChange={() => toggleVisualization('radial')}
            style={{ display: 'none' }}
          />
          Radial
        </label>

        <label
          style={showWaveform ? labelActiveStyle : labelStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = showWaveform
              ? labelActiveStyle.backgroundColor
              : labelStyle.backgroundColor;
          }}
        >
          <input
            type="checkbox"
            checked={showWaveform}
            onChange={() => toggleVisualization('waveform')}
            style={{ display: 'none' }}
          />
          Waveform
        </label>
      </div>
    </div>
  );
};

const intensityStyle = {
  marginTop: '10px',
  fontSize: '18px',
  color: '#ddd',
  backgroundColor: '#111',
  padding: '15px',
  borderRadius: '8px',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '15px',
  justifyContent: 'center',
  alignItems: 'center',
};

const buttonStyle = {
  // padding: '10px 15px',
  // padding: '20px',

  backgroundColor: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '18px',

  padding: '8px 12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  fontWeight: 'bold',
};

const buttonActiveStyle = {
  ...buttonStyle,
  backgroundColor: '#00ffcc',
  color: '#000',
  fontWeight: 'bold',
};

const labelStyle = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: '#222',
  borderRadius: '5px',
  transition: 'background-color 0.2s, border 0.5s',
};

const labelActiveStyle = {
  ...labelStyle,
  backgroundColor: '#00ffcc',
  color: '#000',
  fontWeight: 'bold',
};


const containerStyle = {
  padding: '20px',
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '8px',
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'center' as const,
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
  color: '#fff',
};

// const intensityStyle = {
//   marginTop: '10px',
//   fontSize: '18px',
//   color: '#ddd',
//   backgroundColor: '#222',
//   padding: '10px',
//   borderRadius: '5px',
//   display: 'flex',
//   gap: '10px',
//   justifyContent: 'center',
//   alignItems: 'center',
// };
