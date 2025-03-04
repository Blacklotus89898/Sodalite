import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from "../stores/hooks";

interface CustomWindow extends Window {
    SpeechRecognition: typeof window.SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof window.SpeechRecognition;
}

declare let window: CustomWindow;

interface VoiceToTextProps {
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    language: string;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ text, setText, language }) => {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [audioLevel, setAudioLevel] = useState<number>(0);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const { theme, chroma } = useTheme();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = useRef<SpeechRecognition | null>(SpeechRecognition ? new SpeechRecognition() : null).current;

    useEffect(() => {
        if (!recognition) {
            return;
        }

        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Handle recognition result
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[0][0].transcript;
            setText(result);
        };

        recognition.onstart = () => {
            setIsListening(true);
            startVisualizer();
        };

        recognition.onend = () => {
            setIsListening(false);
            stopVisualizer();
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            stopVisualizer();
        };

        return () => {
            recognition.stop();
            stopVisualizer();
        };
    }, [recognition, language]);

    const startRecognition = () => {
        if (!recognition) {
            return;
        }
        setText('');
        recognition.start();
    };

    const startVisualizer = async () => {
        try {
            audioContextRef.current = new AudioContext();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const audioContext = audioContextRef.current;
            analyserRef.current = audioContext.createAnalyser();
            analyserRef.current.fftSize = 256;

            const microphone = audioContext.createMediaStreamSource(stream);
            microphoneRef.current = microphone;
            microphone.connect(analyserRef.current);

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const tick = () => {
                analyserRef.current?.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
                setAudioLevel(average / 256); // Normalize to 0-1 range
                animationFrameRef.current = requestAnimationFrame(tick);
            };

            tick();
        } catch (err) {
            console.error("Audio visualizer error:", err);
        }
    };

    const stopVisualizer = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        analyserRef.current?.disconnect();
        microphoneRef.current?.disconnect();
        audioContextRef.current?.close();
        setAudioLevel(0);
    };

    useEffect(() => {
        return () => {
            recognition.stop();
            stopVisualizer();
        };
    }, []);

    const containerStyle = {
        padding: '10px',
        backgroundColor: theme === "dark" ? '#333' : '#fff',
        color: theme === "dark" ? '#fff' : '#333',
        borderRadius: '5px',
        boxShadow: theme === "dark" ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center' as const,
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: theme === "dark" ? '#555' : '#f0f0f0',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '15px',
    };

    const resultStyle = {
        marginTop: '15px',
        color: theme === "dark" ? '#ddd' : '#333',
    };

    const visualizerStyle = {
        height: '10px',
        width: `${audioLevel * 100}%`,
        backgroundColor: chroma,
        transition: 'width 50ms linear',
    };

    return (
        <div style={containerStyle}>
            <button
                onClick={startRecognition}
                disabled={isListening}
                style={buttonStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme === "dark" ? '#555' : '#f0f0f0'}
            >
                {isListening ? 'Listening...' : 'Start Voice Recognition'}
            </button>

            {isListening && (
                <div style={{ width: '100%', backgroundColor: '#ccc', height: '10px', margin: '10px 0', borderRadius: '5px' }}>
                    <div style={visualizerStyle}></div>
                </div>
            )}

            <div style={resultStyle}>
                <p>{text}</p> {/* This now correctly shows recognized text */}
            </div>
        </div>
    );
};

export default VoiceToText;
