import React, { useState, useEffect } from "react";
import { useTheme } from '../stores/hooks'; // Import your theme hook
import { Container } from "./container";

interface TimerProps {
  initialTime: number; // Time in seconds
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [inputHours, setInputHours] = useState(Math.floor(initialTime / 3600));
  const [inputMinutes, setInputMinutes] = useState(Math.floor((initialTime % 3600) / 60));
  const [inputSeconds, setInputSeconds] = useState(initialTime % 60);
  const { theme, chroma } = useTheme(); // Access the current theme and chroma

  const isDarkMode = theme === 'dark';
  const totalSeconds = inputHours * 3600 + inputMinutes * 60 + inputSeconds;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Speak only once when time's up
            const utterance = new SpeechSynthesisUtterance("Times Up");
            window.speechSynthesis.speak(utterance);

            setIsActive(false); // Stop the timer when time's up
            resetTimer(); // Reset the timer
            return 0; // Stop the countdown
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Clean up: clear the interval when effect runs again or component unmounts
    return () => clearInterval(timer);
  }, [isActive, timeLeft]); // Depend on both `isActive` and `timeLeft`

  // Start or stop the timer
  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  // Reset the timer to the initial time or current input time
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds); // Reset to the input time
  };

  const updateTimeLeft = (hours: number, minutes: number, seconds: number) => {
    setTimeLeft(hours * 3600 + minutes * 60 + seconds);
  };

  // Handle input change for hours, minutes, and seconds
  const handleTimeChange = () => {
    updateTimeLeft(inputHours, inputMinutes, inputSeconds);
    resetTimer(); // Reset the timer and apply new input values immediately
  };

  // Convert timeLeft into a "hh:mm:ss" format
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const progressArc = (time: number) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (time / totalSeconds) * circumference;
    return { strokeDasharray: circumference, strokeDashoffset: offset, transition: '2s' };
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkMode ? '#222' : '#fff', // Background color based on theme
    color: isDarkMode ? '#fff' : '#000', // Text color based on theme
    height: '100vh',
    fontFamily: `'Arial', sans-serif`,
    textAlign: 'center',
    padding: '20px',
    transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out', // Smooth theme transition
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: chroma, // Use chroma for header color
  };

  const timeDisplayStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: isDarkMode ? '#fff' : '#000', // Time text color based on theme
  };

  const inputContainerStyle: React.CSSProperties = {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  };

  const inputStyle: React.CSSProperties = {
    fontSize: '18px',
    padding: '10px',
    width: '80px',
    textAlign: 'center',
    border: `2px solid ${chroma}`, // Use chroma for input border
    borderRadius: '5px',
    backgroundColor: isDarkMode ? '#333' : '#f9f9f9', // Input background based on theme
    color: isDarkMode ? '#fff' : '#000', // Input text color based on theme
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: 'none',
    backgroundColor: chroma, // Use chroma for button background color
    color: '#000',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    boxShadow: isDarkMode ? '0px 4px 6px rgba(0, 0, 0, 0.5)' : '0px 4px 6px rgba(0, 0, 0, 0.1)', // Button shadow based on theme
  };

  return (
    <Container>
      <div style={containerStyle}>
        <h2 style={headerStyle}>Timer</h2>

        {/* Circular Progress Bar */}
        <svg width="200" height="200" style={{ position: 'relative', zIndex: 1 }}>
          <circle
            cx="100"
            cy="100"
            r="45"
            stroke={chroma} // Use chroma for the ring color
            strokeWidth="10"
            fill="none"
            style={progressArc(timeLeft)}
          />
        </svg>

        <p style={timeDisplayStyle}>{formatTime(timeLeft)}</p>

        {/* Time input fields to change the timer */}
        <div style={inputContainerStyle}>
          <input
            type="number"
            value={inputHours}
            onChange={(e) => setInputHours(Number(e.target.value))}
            style={inputStyle}
            min="0"
            max="99"
            onBlur={handleTimeChange}
            onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
            onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
          />
          <span>:</span>
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value))}
            style={inputStyle}
            min="0"
            max="59"
            onBlur={handleTimeChange}
          />
          <span>:</span>
          <input
            type="number"
            value={inputSeconds}
            onChange={(e) => setInputSeconds(Number(e.target.value))}
            style={inputStyle}
            min="0"
            max="59"
            onBlur={handleTimeChange}
          />
        </div>

        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={toggleTimer}>
            {isActive ? "Pause" : "Start"}
          </button>
          <button style={buttonStyle} onClick={resetTimer}>Reset</button>
        </div>
      </div>
    </Container>
  );
};

export default Timer;
