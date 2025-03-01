import React from "react";
import { useTheme } from "../stores/hooks"; // Import the custom hook

export const ThemeSwitcher = () => {
    const { theme, setTheme, chroma, setChroma } = useTheme();

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    const handleChromaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setChroma(newColor); // Update global state directly
    };

    return (
        <div style={containerStyle}>
            {/* Chroma Picker */}
            <div style={{ position: "relative", width: "60px", height: "32px" }}>
                <input
                    id="chroma-picker"
                    type="color"
                    value={chroma} // Use global state chroma
                    onChange={handleChromaChange}
                    style={hiddenColorInputStyle}
                    aria-label="Choose Chroma Color"
                />
                <button
                    style={{
                        ...chromaButtonStyle,
                        backgroundColor: theme === "light" ? "white" : "black",
                        color: chroma,     // Text color = chroma color (using global state)
                        borderColor: chroma // Border color = chroma color (using global state)
                    }}
                    onClick={() => document.getElementById("chroma-picker")?.click()}
                >
                    Chroma
                </button>
            </div>

            {/* Theme Toggle Switch */}
            <label style={switchLabelStyle}>
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                    style={hiddenInputStyle}
                />
                <div style={{ ...switchTrackStyle, backgroundColor: theme === "light" ? "#ddd" : "#555" }}>
                    <div style={{
                        ...switchThumbStyle,
                        transform: theme === "light" ? "translateX(0)" : "translateX(24px)",
                        backgroundColor: theme === "light" ? "#f5d76e" : "#2c3e50"
                    }}>
                        {theme === "light" ? "☀️" : "🌙"}
                    </div>
                </div>
            </label>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
};

// Theme Switch Styles
const switchLabelStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
};

const switchTrackStyle: React.CSSProperties = {
    width: "48px",
    height: "24px",
    borderRadius: "9999px",
    position: "relative",
    transition: "background-color 0.3s ease",
};

const switchThumbStyle: React.CSSProperties = {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    position: "absolute",
    top: "0",
    left: "0",
    transition: "transform 0.3s ease, background-color 0.3s ease",
};

const hiddenInputStyle: React.CSSProperties = {
    display: "none",
};

// Hidden actual color input
const hiddenColorInputStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
};

// The visible chroma button
const chromaButtonStyle: React.CSSProperties = {
    width: "60px",  // Adjusted width
    height: "32px", // Adjusted height
    borderRadius: "8px",
    borderWidth: "5px",    // Slightly thicker border for visibility
    fontSize: "0.8rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    boxSizing: "border-box"
};

export default ThemeSwitcher;
