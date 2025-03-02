import React, { useState, useEffect } from 'react';

interface CustomWindow extends Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
}

declare let window: CustomWindow;

interface VoiceToTextProps {
    setText: React.Dispatch<React.SetStateAction<string>>;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ setText }) => {
    const [isListening, setIsListening] = useState<boolean>(false);

    // Cross-browser SpeechRecognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        return <p>Your browser does not support Speech Recognition.</p>;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
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

    return (
        <div>
            <button onClick={startRecognition} disabled={isListening}>
                {isListening ? 'Listening...' : 'Start Voice Recognition'}
            </button>
            <p>Recognized Text: {setText ? 'You can see the recognized text above.' : ''}</p>
        </div>
    );
};

export default VoiceToText;
