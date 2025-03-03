import React, { useState } from "react";
import { Container } from "./container";
import TextToVoice from "./textToVoice";
import VoiceToText from "./voiceToText";
import { useTheme } from "../stores/hooks"; // Use your custom theme hook

const TranslationComponent = () => {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("en");
    const [sourceLanguage, setSourceLanguage] = useState("auto");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { theme } = useTheme(); // Get the current theme from the context

    const handleTranslate = async () => {
        if (!text.trim()) return; // Don't proceed if the input text is empty

        setIsLoading(true);
        setError(null); // Reset error state before each new translation

        try {
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`
            );
            
            if (!response.ok) throw new Error("Failed to fetch translation.");

            const result = await response.json();
            console.log("Translation result:", result);

            // Check if the translation result is as expected
            if (result && result[0] && result[0][0] && result[0][0][0]) {
                setTranslatedText(result[0][0][0]);
            } else {
                throw new Error("Unexpected translation response format.");
            }
        } catch (error: unknown) {
            console.error("Translation error:", error);
            setError("Translation failed. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle = {
        padding: '20px',
        backgroundColor: theme === "dark" ? '#333' : '#fff', // Dynamic background based on theme
        color: theme === "dark" ? '#fff' : '#333', // Dynamic text color based on theme
        borderRadius: '10px',
        maxWidth: '800px',
        margin: 'auto',
        boxShadow: theme === "dark" ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)', // Adjust shadow for dark mode
        textAlign: 'center' as const,
    };

    const headerStyle = {
        fontSize: '28px',
        marginBottom: '20px',
        color: theme === "dark" ? '#fff' : '#333', // Dynamic color based on theme
        fontWeight: 'bold',
    };

    const inputStyle = {
        padding: '10px',
        marginBottom: '15px',
        width: '100%',
        backgroundColor: theme === "dark" ? '#555' : '#f0f0f0', // Dynamic background for input field
        color: theme === "dark" ? '#fff' : '#333', // Dynamic text color for input field
        border: theme === "dark" ? '1px solid #444' : '1px solid #ddd', // Border for light mode
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box' as const,
    };

    const selectWrapperStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '15px',
    };

    const selectStyle = {
        padding: '10px',
        backgroundColor: theme === "dark" ? '#555' : '#f0f0f0', // Dynamic background
        color: theme === "dark" ? '#fff' : '#333', // Dynamic text color
        border: theme === "dark" ? '1px solid #444' : '1px solid #ddd', // Border for light mode
        borderRadius: '5px',
        fontSize: '16px',
        width: '45%',
        boxSizing: 'border-box' as const,
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    };

    const resultStyle = {
        marginTop: '20px',
        color: theme === "dark" ? '#ddd' : '#333', // Dynamic text color for results
    };

    const errorStyle = {
        marginTop: '10px',
        color: '#e74c3c',
        fontSize: '14px',
    };

    return (
        <Container>
            <div style={containerStyle}>
                <h1 style={headerStyle}>Translation Component</h1>

                {/* Voice input field */}    
                <VoiceToText setText={setText} language={sourceLanguage} />

                {/* Input text field */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to translate"
                    style={inputStyle}
                />

                {/* Language selection */}
                <div style={selectWrapperStyle}>
                    <select
                        value={sourceLanguage}
                        onChange={(e) => setSourceLanguage(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="auto">Detect Language</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        {/* Add more language options as needed */}
                    </select>
                    <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        {/* Add more language options as needed */}
                    </select>
                </div>

                {/* Translate Button */}
                <button
                    onClick={handleTranslate}
                    style={buttonStyle}
                    disabled={isLoading || !text.trim()}
                >
                    {isLoading ? "Translating..." : "Translate"}
                </button>

                {/* Error Message */}
                {error && <p style={errorStyle}>{error}</p>}

                {/* Translated Text */}
                <div style={resultStyle}>
                    <h2>Translated Text</h2>
                    <p>{translatedText || "Translation will appear here."}</p>
                </div>
            </div>

            {/* Pass the translatedText and targetLanguage as props to TextToVoice */}
            <TextToVoice text={translatedText} language={targetLanguage} />

            {/* Pass setText and sourceLanguage as props to VoiceToText */}
        </Container>
    );
};

export default TranslationComponent;
