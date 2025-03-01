import { useTheme } from '../stores/hooks';

interface ContainerProps {
    children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
    const { theme, chroma } = useTheme();

    const isDarkMode = theme === 'dark';

    const containerStyle: React.CSSProperties = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        color: isDarkMode ? 'white' : 'black',
        border: `2px solid ${chroma}`,
        borderRadius: '15px',
        padding: '2px',
        boxShadow: isDarkMode
            ? '0px 4px 12px rgba(0, 0, 0, 0.6)'
            : '0px 4px 12px rgba(200, 200, 200, 0.6)',
        transition: 'background-color 0.3s ease, color 0.3s ease, border 0.3s ease',
    };

    return <div style={containerStyle}>{children}</div>;
};
