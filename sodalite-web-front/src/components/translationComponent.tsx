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
        <div>
            <h1>Translation Component</h1>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to translate"
            />
            <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
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
            >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                {/* Add more language options as needed */}
            </select>
            <button onClick={handleTranslate}>Translate</button>
            <div>
                <h2>Translated Text</h2>
                <p>{translatedText}</p>
            </div>
        </div>
    );
};

export default TranslationComponent;
