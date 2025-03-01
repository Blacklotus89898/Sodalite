import React, { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number; // Time in seconds
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [inputTime, setInputTime] = useState(initialTime); // Input field value

  // Sound alert when the timer reaches zero
  // const sound = new Audio("none"); // Default beep sound

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // If the timer is active and timeLeft > 0, set interval
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } 
    // If the timer reaches zero, stop the interval and play the sound
    if (timeLeft === 0) {
      // sound.play();
    const utterance = new SpeechSynthesisUtterance("Times Up");
    window.speechSynthesis.speak(utterance);

      setIsActive(false);
      window.alert("Time's up!");
    }

    // Cleanup the interval on component unmount or when the timer is paused
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Start or stop the timer
  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  // Reset the timer to the initial time
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(inputTime); // Reset to the input time
  };

  // Update the timeLeft with the user input
  const setCustomTime = () => {
    setTimeLeft(inputTime);
  };

  // Convert timeLeft into a "mm:ss" format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Timer</h2>
      <p style={timeDisplayStyle}>{formatTime(timeLeft)}</p>

      {/* Time input field to change the timer */}
      <div style={inputContainerStyle}>
        <input
          type="number"
          value={inputTime}
          onChange={(e) => setInputTime(Number(e.target.value))}
          style={inputStyle}
          min="0"
        />
        <button style={buttonStyle} onClick={setCustomTime}>Set Time</button>
      </div>

      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={toggleTimer}>
          {isActive ? "Pause" : "Start"}
        </button>
        <button style={buttonStyle} onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#333',
  color: '#fff',
  height: '100vh',
  fontFamily: `'Arial', sans-serif`,
  textAlign: 'center' as const,
  padding: '20px',
};

const headerStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#00ffcc',
};

const timeDisplayStyle = {
  fontSize: '48px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#fff',
};

const inputContainerStyle = {
  marginBottom: '20px',
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
};

const inputStyle = {
  fontSize: '18px',
  padding: '10px',
  width: '80px',
  textAlign: 'center',
  border: '2px solid #00ffcc',
  borderRadius: '5px',
  backgroundColor: '#333',
  color: '#fff',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '20px',
};

const buttonStyle = {
  padding: '15px 30px',
  fontSize: '18px',
  fontWeight: 'bold',
  border: 'none',
  backgroundColor: '#00ffcc',
  color: '#000',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background-color 0.3s ease',
};

export default Timer;
