import { useTheme } from "../stores/hooks"; // Import the custom hook

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme(); // Get theme and setTheme

    return (
        <div 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{ fontSize: "2rem", cursor: "pointer" }} // Add styles for bigger button
        >
            {theme === "light" ? "🌞" : "🌚"}
        </div>
    );
};
