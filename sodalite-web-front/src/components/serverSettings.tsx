import { useState, useRef, useEffect } from 'react';
import { useServer, useTheme } from '../stores/hooks';
import { Container } from './container';

const UpdateAddress = () => {
    const { address, setAddress } = useServer();
    const { theme, chroma } = useTheme();

    const [selectedKey, setKey] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [width, setWidth] = useState(400); // Default width for initial render

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const isDarkMode = theme === 'dark';

    // Calculate scalable font sizes with min and max limits
    const baseFontSize = Math.min(24, Math.max(12, width * 0.05));
    const inputFontSize = baseFontSize * 0.85;
    const buttonFontSize = baseFontSize * 0.95;
    const titleFontSize = baseFontSize * 1.2;

    const containerStyle: React.CSSProperties = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        color: isDarkMode ? 'white' : 'black',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '400px',
        margin: 'auto',
        boxShadow: isDarkMode ? '0px 4px 10px rgba(0, 0, 0, 0.3)' : '0px 4px 10px rgba(200, 200, 200, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        fontSize: baseFontSize,
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px',
        borderRadius: '5px',
        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
        backgroundColor: 'transparent',
        color: isDarkMode ? 'white' : 'black',
        fontSize: inputFontSize,
        outline: 'none',
        transition: 'border 0.3s ease',
    };

    const buttonStyle: React.CSSProperties = {
        backgroundColor: chroma,
        color: isDarkMode ? 'black' : 'white',
        border: 'none',
        padding: '12px',
        fontSize: buttonFontSize,
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
    };

    const itemStyle: React.CSSProperties = {
        padding: '10px',
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        color: isDarkMode ? 'white' : 'black',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: inputFontSize,
        transition: 'background 0.3s ease',
    };

    const activeItemStyle: React.CSSProperties = {
        ...itemStyle,
        backgroundColor: chroma,
        color: isDarkMode ? 'black' : 'white',
    };

    const handleUpdate = () => {
        if (selectedKey && newAddress) {
            setAddress(selectedKey, newAddress);
        }
    };

    const handleItemClick = (key: string, selectedAddress: string) => {
        setKey(key);
        setNewAddress(selectedAddress);
    };

    return (
        <Container maxWidth={1200} maxHeight={1200}>
            <div ref={containerRef} style={containerStyle}>
                <h3 style={{ textAlign: 'center', fontSize: titleFontSize, marginBottom: '10px' }}>
                    Update Address
                </h3>

                <h4 style={{ fontSize: baseFontSize, marginBottom: '10px' }}>Select an Address to Edit:</h4>

                {/* Scrollable List */}
                <div style={{
                    maxHeight: '150px', overflowY: 'scroll', paddingRight: '5px', scrollbarWidth: 'thin',
                    scrollbarColor: isDarkMode ? '#666 #333' : '#bbb #eee', marginBottom: '15px'
                }}>
                    {Object.entries(address).map(([key, addr], index) => (
                        <div
                            key={index}
                            style={key === selectedKey ? activeItemStyle : itemStyle}
                            onClick={() => handleItemClick(key, addr)}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = chroma;
                                e.currentTarget.style.color = "white"}
                            }
                            onMouseOut={(e) =>{
                                e.currentTarget.style.backgroundColor = key === selectedKey ? chroma : itemStyle.backgroundColor as string
                                e.currentTarget.style.color = key === selectedKey ? "white" : 
                                    isDarkMode ? 'white' : 'black'
                            }
                            }
                        >
                            <strong>{key}</strong>: {addr}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        value={selectedKey}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Enter server key (e.g., server1)"
                        style={inputStyle}
                        onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
                        onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
                        onFocus={(e) => e.target.style.border = `1px solid ${chroma}`}
                        onBlur={(e) => e.target.style.border = inputStyle.border as string}
                    />
                    <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Enter new address"
                        style={inputStyle}
                        onMouseOver={(e) => e.currentTarget.style.border = `1px solid ${chroma}`}
                        onMouseOut={(e) => e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.3)'}
                        onFocus={(e) => e.target.style.border = `1px solid ${chroma}`}
                        onBlur={(e) => e.target.style.border = inputStyle.border as string}
                    />
                    <button
                        onClick={handleUpdate}
                        style={buttonStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = chroma}
                    >
                        Update Address
                    </button>
                </div>
            </div>
        </Container>
    );
};

export default UpdateAddress;
