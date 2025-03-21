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

    const { theme, chroma } = useTheme(); // Get the current theme from the context

    const handleTranslate = async () => {
        if (!text.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`
            );

            if (!response.ok) throw new Error("Failed to fetch translation.");

            const result = await response.json();
            console.log("Translation result:", result);

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: 'clamp(10px, 3vw, 20px)',
        backgroundColor: theme === "dark" ? '#333' : '#fff',
        color: theme === "dark" ? '#fff' : '#333',
        borderRadius: '10px',
        maxWidth: '90vw',
        margin: 'auto',
        boxShadow: theme === "dark" ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center' as const,
        height: '100%',
    };

    const inputContainerStyle = {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const headerStyle = {
        fontSize: 'clamp(20px, 4vw, 32px)', // Scales between 20px and 32px
        marginBottom: 'clamp(10px, 2vw, 20px)',
        fontWeight: 'bold',
    };

    const inputStyle = {
        padding: 'clamp(8px, 2vw, 12px)',
        marginBottom: 'clamp(10px, 2vw, 15px)',
        width: '100%',
        backgroundColor: theme === "dark" ? '#555' : '#f0f0f0',
        color: theme === "dark" ? '#fff' : '#333',
        border: theme === "dark" ? '1px solid #444' : '1px solid #ddd',
        borderRadius: '5px',
        fontSize: 'clamp(14px, 2vw, 18px)', // Responsive text
        boxSizing: 'border-box' as const,
        resize: "vertical",
        flexGrow: 1,
    };

    const selectWrapperStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: 'clamp(10px, 2vw, 15px)',
    };

    const selectStyle = {
        padding: 'clamp(8px, 2vw, 12px)',
        backgroundColor: theme === "dark" ? '#555' : '#f0f0f0',
        color: theme === "dark" ? '#fff' : '#333',
        border: theme === "dark" ? '1px solid #444' : '1px solid #ddd',
        borderRadius: '5px',
        fontSize: 'clamp(14px, 2vw, 18px)',
        width: '45%',
        boxSizing: 'border-box' as const,
    };

    const buttonStyle = {
        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: 'clamp(14px, 2vw, 18px)',
        cursor: 'pointer',
    };

    const resultStyle = {
        marginTop: 'clamp(10px, 2vw, 20px)',
        color: theme === "dark" ? '#ddd' : '#333',
    };

    const errorStyle = {
        marginTop: '10px',
        color: '#e74c3c',
        fontSize: 'clamp(12px, 2vw, 16px)',
    };

    return (
        <Container maxWidth={1100} maxHeight={1250} style={{ height: "100%" }}>
            <div style={containerStyle}>
                <h1 style={headerStyle}>Translation Component</h1>

                <div style={inputContainerStyle}>
                    <VoiceToText setText={setText} language={sourceLanguage} />

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to translate"
                        rows={4}
                        style={inputStyle}
                        onMouseOver={(e) => e.currentTarget.style.border = `2px solid ${chroma}`}
                        onMouseOut={(e) => e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.3)'}
                    />
                </div>

                <div style={selectWrapperStyle}>
                    <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} style={selectStyle}>
                        <option value="auto">Detect Language</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </select>
                    <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} style={selectStyle}>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </select>
                </div>

                <button
                    onClick={handleTranslate}
                    style={buttonStyle}
                    disabled={isLoading || !text.trim()}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor as string;
                    }}
                >
                    {isLoading ? "Translating..." : "Translate"}
                </button>

                {error && <p style={errorStyle}>{error}</p>}

                <div style={resultStyle}>
                    <h2>Translated Text</h2>
                    <p style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>
                        {translatedText || "Translation will appear here."}
                    </p>
                </div>

                <TextToVoice text={translatedText} targetLanguage={targetLanguage} />
            </div>
        </Container>
    );
};

export default TranslationComponent;
