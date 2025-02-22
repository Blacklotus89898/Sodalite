import React from 'react';
import { ThemeSwitcher } from './themeSwitcher';

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const headerStyle: React.CSSProperties = {
        position: 'sticky',
        top: 0,
        width: '100vw',
        backgroundColor: 'rgba(0, 0, 0, 0.99)',
        color: 'white',
        zIndex: 1000,
        padding: '10px',
        paddingLeft: '3%',
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
    };

    return (
        <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>Sodalite Web</h1>
                <ThemeSwitcher />
            </div>
            {!isDropdownOpen &&

                <button style={buttonStyle} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    V
                </button>
            }
            {isDropdownOpen && (
                <div style={{
                    display: 'flex', flexDirection: 'column',

                }}>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-around" }}>
                        <a href="#ChatApp">Chat</a>
                        <a href="#sandbox">Sandbox</a>
                        <a href="#Iframe">Iframe</a>
                        <a href="#AudioIntensity">Audio Intensity</a>
                        <a href="#CanvaShare">Canva Share</a>
                    </div>
                    {isDropdownOpen &&
                        <button style={buttonStyle} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                            A
                        </button>}
                </div>
            )}
        </div>
    );
};

export default Header;
