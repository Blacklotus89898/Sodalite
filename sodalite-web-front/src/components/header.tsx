import React from 'react';
import { ThemeSwitcher } from './themeSwitcher';
import { Link } from 'react-router-dom';
import { useTheme } from '../stores/hooks'; // Import your theme hook

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const { theme } = useTheme(); // Access the current theme

    const isDarkMode = theme === 'dark';

    const headerStyle: React.CSSProperties = {
        position: 'sticky',
        top: 0,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.99)' : 'rgba(255, 255, 255, 0.99)',
        color: isDarkMode ? 'white' : 'black',
        zIndex: 1000,
        padding: '10px 3%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
        border: 'none',
        color: isDarkMode ? 'white' : 'black',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '5px 10px',
        borderRadius: '5px',
        transition: 'background 0.3s ease, color 0.3s ease',
    };

    const dropdownStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        opacity: isDropdownOpen ? 1 : 0,
        maxHeight: isDropdownOpen ? '250px' : '0px',
        overflowY: 'auto',
        transition: 'opacity 0.4s ease, max-height 0.4s ease-in-out',
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        padding: isDropdownOpen ? '10px' : '0px',
        borderRadius: '8px',
        boxShadow: isDarkMode
            ? '0px 4px 6px rgba(0, 0, 0, 0.5)'
            : '0px 4px 6px rgba(0, 0, 0, 0.1)',
        scrollbarWidth: 'thin',
        scrollbarColor: isDarkMode ? '#666 #333' : '#bbb #eee',
    };

    const linkStyle: React.CSSProperties = {
        color: isDarkMode ? 'white' : 'black',
        textDecoration: 'none',
        padding: '10px 15px',
        transition: 'color 0.3s ease',
        display: 'block',
        whiteSpace: 'nowrap',
    };

    return (
        <div style={headerStyle}>
            {/* Header Title & Theme Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ flex: '1', color: isDarkMode ? 'white' : 'black' }}>Sodalite Web</h1>
                <ThemeSwitcher />
                <button
                    style={buttonStyle}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {isDropdownOpen ? '▲' : '▼'}
                </button>
            </div>

            {/* Scrollable Dropdown Menu */}
            <div style={dropdownStyle}>
                <Link to="/" style={linkStyle}>Soldalite</Link>
                <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                <Link to="/home" style={linkStyle}>Home</Link>
                <Link to="/rnd" style={linkStyle}>RND</Link>
                <Link to="/sandbox" style={linkStyle}>Sandbox</Link>
                <Link to="/music" style={linkStyle}>Music</Link>
                <Link to="/whitelotus" style={linkStyle}>Whitelotus</Link>
                <Link to="/notfound" style={linkStyle}>NotFound</Link>
                <a href="#ChatApp" style={linkStyle}>Chat</a>
                <a href="#Iframe" style={linkStyle}>Iframe</a>
                <a href="#AudioIntensity" style={linkStyle}>Audio Intensity</a>
                <a href="#CanvaShare" style={linkStyle}>Canva Share</a>
            </div>
        </div>
    );
};

export default Header;
