import React from 'react';

const Footer: React.FC = () => {
    const footerStyle: React.CSSProperties = {
        backgroundColor: 'rgba(0, 0, 0, 0.95)', // Matches header & sidebar
        color: 'white',
        textAlign: 'center',
        padding: '1rem 0',
        // position: 'fixed', // Change to 'fixed' if you want it always visible
        bottom: 0,
        width: '100%',
        boxShadow: '0px -4px 6px rgba(0, 0, 0, 0.2)',
        transition: 'background 0.3s ease-in-out',
        zIndex: -1,
    };

    const linkStyle: React.CSSProperties = {
        color: 'white',
        textDecoration: 'none',
        margin: '0 10px',
        transition: 'color 0.3s ease',
    };

    return (
        <footer style={footerStyle}>
            <div>
                <p>&copy; {new Date().getFullYear()} Blackotus89898 - Sodalite. All rights reserved.</p>
                <div>
                    <a href="#privacy" style={linkStyle}
                        onMouseOver={(e) => e.currentTarget.style.color = 'lightgray'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                    >
                        Privacy Policy
                    </a>
                    |
                    <a href="#terms" style={linkStyle}
                        onMouseOver={(e) => e.currentTarget.style.color = 'lightgray'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'white'}
                    >
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
