import React from 'react';

const Header: React.FC = () => {
    const headerStyle: React.CSSProperties = {
        position: 'sticky',
        top: 0,
        width: '100hw',
        backgroundColor: 'Black',
        color: 'white',
        zIndex: 1000,
        padding: '10px',
        paddingLeft: '3%',
        flex: '1 1 auto',
    };

    return (
        <div style={headerStyle}>
            <h1>Sodalite Web</h1>
        </div>
    );
};

export default Header;
