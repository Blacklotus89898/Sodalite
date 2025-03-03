    import { useState } from 'react';
    import { useTheme } from '../stores/hooks';

    interface ContainerProps {
        children: React.ReactNode;
    }

    export const Container: React.FC<ContainerProps> = ({ children }) => {
        const { theme, chroma } = useTheme();
        const isDarkMode = theme === 'dark';
        
        // State to track if the container is hovered
        const [isHovered, setIsHovered] = useState(false);

        const containerStyle: React.CSSProperties = {
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            color: isDarkMode ? 'white' : 'black',
            border: isHovered ? `2px solid ${chroma}` : '2px solid transparent', // Border appears on hover
            borderRadius: '15px',
            padding: '2px',
            boxShadow: isDarkMode
                ? '0px 4px 12px rgba(0, 0, 0, 0.6)'
                : '0px 4px 12px rgba(200, 200, 200, 0.6)',
            transition: 'background-color 0.3s ease, color 0.3s ease, border 0.3s ease',
        };

        return (
            <div
                style={containerStyle}
                onMouseEnter={() => setIsHovered(true)}  // Set hover state to true when mouse enters
                onMouseLeave={() => setIsHovered(false)} // Set hover state to false when mouse leaves
            >
                {children}
            </div>
        );
    };
