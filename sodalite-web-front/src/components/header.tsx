import React from 'react';
import { ThemeSwitcher } from './themeSwitcher';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const headerStyle: React.CSSProperties = {
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.99)',
        color: 'white',
        zIndex: 1000,
        padding: '10px 3%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.3s ease-in-out',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '5px 10px',
        borderRadius: '5px',
        transition: 'background 0.3s ease',
    };

    const dropdownStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        opacity: isDropdownOpen ? 1 : 0,
        maxHeight: isDropdownOpen ? '250px' : '0px', // Increased max height for scrolling
        overflowY: 'auto', // Enables vertical scrolling when needed
        transition: 'opacity 0.4s ease, max-height 0.4s ease-in-out',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: isDropdownOpen ? '10px' : '0px',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        scrollbarWidth: 'thin', // For Firefox
        scrollbarColor: '#666 #333', // Custom scrollbar color
    };

    const linkStyle: React.CSSProperties = {
        color: 'white',
        textDecoration: 'none',
        padding: '10px 15px',
        transition: 'color 0.3s ease',
        display: 'block',
        whiteSpace: 'nowrap', // Prevents text from wrapping
    };

    return (
        <div style={headerStyle}>
            {/* Header Title & Theme Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1>Sodalite Web</h1>
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
                <Link to="/" style={linkStyle}>Dashboard</Link>
                <Link to="/home" style={linkStyle}>Home</Link>
                <Link to="/sandbox" style={linkStyle}>Sandbox</Link>
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
