import React, { useState, useEffect, useRef } from "react";
import { useTheme } from '../stores/hooks';
import { Container } from "./container";

interface TimerProps {
  initialTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [inputHours, setInputHours] = useState(Math.floor(initialTime / 3600));
  const [inputMinutes, setInputMinutes] = useState(Math.floor((initialTime % 3600) / 60));
  const [inputSeconds, setInputSeconds] = useState(initialTime % 60);
  const { theme, chroma } = useTheme();

  const isDarkMode = theme === 'dark';
  const totalSeconds = inputHours * 3600 + inputMinutes * 60 + inputSeconds;

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(200);
  const [fontSize, setFontSize] = useState(48);
  const [titleFontSize, setTitleFontSize] = useState(24);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setSize(Math.max(150, width * 0.5)); // Adjust circle size dynamically
        setFontSize(Math.max(20, width * 0.08)); // Adjust text size dynamically
        setTitleFontSize(Math.max(24, width * 0.1)); // Adjust title size dynamically
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            const utterance = new SpeechSynthesisUtterance("Time's up");
            window.speechSynthesis.speak(utterance);
            setIsActive(false);
            resetTimer();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive((prev) => !prev);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const progressArc = (time: number) => {
    const radius = size / 3; // Scale radius dynamically
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (time / totalSeconds) * circumference;
    return { strokeDasharray: circumference, strokeDashoffset: offset, transition: '0.5s linear' };
  };

  return (
    <Container maxWidth={600} maxHeight={1000}>
      <div ref={containerRef} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#000',
       fontFamily: `'Arial', sans-serif`, textAlign: 'center', padding: '20px',
        transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
        height: '100%', // Ensure it takes full height
      }}>
        <h2 style={{ fontSize: `${titleFontSize}px`, fontWeight: 'bold', marginBottom: '20px', color: chroma }}>
          Timer
        </h2>

        {/* Scalable Circular Progress Bar */}
        <svg width={size} height={size} viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={size / 3} stroke="#ccc" strokeWidth="10" fill="none" />
          <circle cx="100" cy="100" r={size / 3} stroke={chroma} strokeWidth="10" fill="none"
            style={progressArc(timeLeft)} />
        </svg>

        <p style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', marginBottom: '20px' }}>
          {formatTime(timeLeft)}
        </p>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {["Hours", "Minutes", "Seconds"].map((label, index) => (
            <input key={label} type="number" min="0" max={index === 0 ? "99" : "59"} value={
              index === 0 ? inputHours : index === 1 ? inputMinutes : inputSeconds
            } onChange={(e) => {
              const value = Number(e.target.value);
              if (index === 0) setInputHours(value);
              else if (index === 1) setInputMinutes(value);
              else setInputSeconds(value);
            }} onBlur={() => resetTimer()} style={{
              fontSize: `${fontSize / 3}px`, padding: '10px', minWidth: '60px', maxWidth: '80px', textAlign: 'center',
              border: `2px solid ${chroma}`, borderRadius: '5px', backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
              color: isDarkMode ? '#fff' : '#000'
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button onClick={toggleTimer} style={{
            padding: '15px 30px', fontSize: `${fontSize / 4}px`, fontWeight: 'bold', border: 'none',
            backgroundColor: chroma, color: '#000', cursor: 'pointer', borderRadius: '8px',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            boxShadow: isDarkMode ? '0px 4px 6px rgba(0, 0, 0, 0.5)' : '0px 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {isActive ? "Pause" : "Start"}
          </button>
          <button onClick={resetTimer} style={{
            padding: '15px 30px', fontSize: `${fontSize / 4}px`, fontWeight: 'bold', border: 'none',
            backgroundColor: chroma, color: '#000', cursor: 'pointer', borderRadius: '8px',
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}>Reset</button>
        </div>
      </div>
    </Container>
  );
};

export default Timer;
