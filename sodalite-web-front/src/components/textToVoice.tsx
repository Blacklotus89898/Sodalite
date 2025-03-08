import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from "../stores/hooks"; // Assuming useTheme hook is defined

interface TextToVoiceProps {
  text: string;
  targetLanguage: string;
}

const TextToVoice: React.FC<TextToVoiceProps> = ({ text, targetLanguage }) => {
  const { theme, chroma } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState("1rem");

  useEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setFontSize(`${Math.max(16, width * 0.02)}px`); // Scale font based on container width
      }
    };

    updateFontSize(); // Initial call
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  const speakText = () => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support speech synthesis.");
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage;
    window.speechSynthesis.speak(utterance);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: '20px',
    backgroundColor: theme === "dark" ? '#333' : '#fff',
    color: theme === "dark" ? '#fff' : '#333',
    borderRadius: '10px',
    margin: 'auto',
    boxShadow: theme === "dark" ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    fontSize,
    transition: 'font-size 0.3s ease', // Smooth scaling
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: theme === "dark" ? '#555' : '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: `calc(${fontSize} * 0.8)`, // Button font scales with container
    transition: 'background-color 0.3s',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <h2 style={{ fontSize: `calc(${fontSize} * 1.2)` }}>Text to Speech</h2>
      <p>{text ? "Click the button to hear the translation:" : "Please translate some text first."}</p>
      <button
        onClick={speakText}
        style={buttonStyle}
        disabled={!text.trim()}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor as string}
      >
        Speak Translated Text
      </button>
    </div>
  );
};

export default TextToVoice;
