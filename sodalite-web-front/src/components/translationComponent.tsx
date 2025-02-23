import { useState } from "react";

const TranslationComponent = () => {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("en");
    const [sourceLanguage, setSourceLanguage] = useState("auto");

    const handleTranslate = async () => {
        try {
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`
            );
            const result = await response.json();
            console.log("Translation result:", result);
            setTranslatedText(result[0][0][0]);
        } catch (error) {
            console.error("Translation error:", error);
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Translation Component</h1>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to translate"
                style={inputStyle}
            />
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
            <button onClick={handleTranslate} style={buttonStyle}>Translate</button>
            <div style={resultStyle}>
                <h2>Translated Text</h2>
                <p>{translatedText}</p>
            </div>
        </div>
    );
};

// Dark theme styling
const containerStyle = {
    padding: '20px',
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '10px',
    maxWidth: '800px',
    margin: 'auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    textAlign: 'center' as const,
};

const headerStyle = {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#fff',
    fontWeight: 'bold',
};

const inputStyle = {
    padding: '10px',
    marginBottom: '15px',
    width: '100%',
    backgroundColor: '#555',
    color: '#fff',
    border: '1px solid #444',
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
    backgroundColor: '#555',
    color: '#fff',
    border: '1px solid #444',
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
    color: '#ddd',
};

export default TranslationComponent;
