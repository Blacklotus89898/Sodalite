import React, { useState, useEffect } from 'react';
import { useTheme } from "../stores/hooks"; // Assuming useTheme hook is defined in your stores/hooks file

interface CustomWindow extends Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
}

declare let window: CustomWindow;

interface VoiceToTextProps {
    setText: React.Dispatch<React.SetStateAction<string>>;
    language: string;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ setText, language }) => {
    const [isListening, setIsListening] = useState<boolean>(false);
    const { theme } = useTheme(); // Get the current theme from the theme context

    // Cross-browser SpeechRecognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        return <p>Your browser does not support Speech Recognition.</p>;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false; // Only final results
    recognition.maxAlternatives = 1; // Max alternative results

    // Start and stop listening based on the recognition state
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        setText(result); // Set the recognized text in the parent component's state
        recognition.stop(); // Explicitly stop after getting result
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
    };

    const startRecognition = () => {
        setText(''); // Clear any previously recognized text
        recognition.start();
    };

    // Cleanup recognition when component unmounts to avoid memory leaks
    useEffect(() => {
        return () => {
            recognition.stop();
        };
    }, []);

    // Dynamic styling based on the current theme (dark or light)
    const containerStyle = {
        padding: '10px',
        backgroundColor: theme === "dark" ? '#333' : '#fff', // Dynamic background
        color: theme === "dark" ? '#fff' : '#333', // Dynamic text color
        borderRadius: '5px',
        boxShadow: theme === "dark" ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)', // Shadow for dark mode
        textAlign: 'center' as const,
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '15px',
        backgroundColor: theme === "dark" ? '#555' : '#f0f0f0', // Dynamic background color for button
    };

    const resultStyle = {
        marginTop: '15px',
        color: theme === "dark" ? '#ddd' : '#333', // Dynamic result text color
    };

    return (
        <div style={containerStyle}>
            <button onClick={startRecognition} disabled={isListening} style={buttonStyle}>
                {isListening ? 'Listening...' : 'Start Voice Recognition'}
            </button>
            <div style={resultStyle}>
                {/* Display the recognized text */}
                <p>{setText}</p>
            </div>
        </div>
    );
};

export default VoiceToText;