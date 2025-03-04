import React from 'react';
import { useTheme } from "../stores/hooks"; // Assuming useTheme hook is defined in your stores/hooks file

interface TextToVoiceProps {
  text: string;
  targetLanguage: string;
}

const TextToVoice: React.FC<TextToVoiceProps> = ({ text, targetLanguage }) => {
  const {theme, chroma} = useTheme(); // Get the current theme (dark or light)

  const speakText = () => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support speech synthesis.");
      return;
        }
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = targetLanguage; // Set the target language for speech synthesis
        window.speechSynthesis.speak(utterance);
  };

  // Dynamic styling based on the current theme (dark or light)
  const containerStyle = {
    padding: '20px',
    backgroundColor: theme === "dark" ? '#333' : '#fff', // Dynamic background
    color: theme === "dark" ? '#fff' : '#333', // Dynamic text color
    borderRadius: '10px',
    maxWidth: '600px',
    margin: 'auto',
    boxShadow: theme === "dark" ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)', // Shadow for dark mode
    textAlign: 'center' as const,
  };

  const headerStyle = {
    fontSize: '24px',
    marginBottom: '10px',
    color: theme === "dark" ? '#fff' : '#333', // Dynamic header text color
    fontWeight: 'bold',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: theme === "dark" ? '#555' : '#3498db', // Button background color changes based on theme
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Text to Speech</h2>
      <p>{text ? "Click the button to hear the translation:" : "Please translate some text first."}</p>
      <button onClick={speakText} style={buttonStyle} disabled={!text.trim()}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = buttonStyle
            .backgroundColor as string
        }}>
        Speak Translated Text
      </button>
    </div>
  );
};

export default TextToVoice;
