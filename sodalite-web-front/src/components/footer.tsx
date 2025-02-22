import React from 'react';

const Footer: React.FC = () => {
    const footerStyle: React.CSSProperties = {
        backgroundColor: '#282c34',
        color: 'white',
        textAlign: 'center',
        padding: '1rem 0',
        // position: 'fixed',
        bottom: 0,
        width: '100%',
    };

    const footerContentStyle: React.CSSProperties = {
        margin: '0 auto',
    };

    return (
        <footer style={footerStyle}>
            <div style={footerContentStyle}>
                <p>&copy; {new Date().getFullYear()} Blackotus89898 - Sodalite. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;