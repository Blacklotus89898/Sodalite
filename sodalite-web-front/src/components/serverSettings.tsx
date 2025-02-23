import { useState } from 'react';
import { useServer } from '../stores/hooks'; // Ensure this path is correct or update it to the correct path

const UpdateAddress = () => {
    const { address, setAddress } = useServer(); // Using the custom hook to access context
    const [key, setKey] = useState('');
    const [newAddress, setNewAddress] = useState('');

    const handleUpdate = () => {
        if (key && newAddress) {
            setAddress(key, newAddress); // Update the address in the context
        }
    };

    const handleItemClick = (selectedKey: string, selectedAddress: string) => {
        setKey(selectedKey);
        setNewAddress(selectedAddress);
    };

    return (
        <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)', 
            color: 'white', 
            borderRadius: '10px', 
            padding: '20px', 
            maxWidth: '400px', 
            margin: 'auto', 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '15px'
        }}>
            <h3 style={{
                textAlign: 'center', 
                fontSize: '22px', 
                marginBottom: '10px'
            }}>Update Address</h3>

            <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>Select an Address to Edit:</h4>

            {/* Scrollable List of Addresses */}
            <div style={{
                maxHeight: '150px', 
                overflowY: 'scroll', 
                paddingRight: '5px',
                marginBottom: '15px'
            }}>
                {Object.entries(address).map(([key, addr], index) => (
                    <div
                        key={index}
                        style={{
                            padding: '10px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '5px',
                            margin: '5px 0',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease',
                        }}
                        onClick={() => handleItemClick(key, addr)}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    >
                        <strong>{key}</strong>: {addr}
                    </div>
                ))}
            </div>

            {/* Form to Update the Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter server key (e.g., server1)"
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'transparent',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border 0.3s ease',
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.8)'}
                    onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                />
                <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter new address"
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'transparent',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border 0.3s ease',
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.8)'}
                    onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                />
                <button
                    onClick={handleUpdate}
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '12px', 
                        fontSize: '16px', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease-in-out',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'}
                >
                    Update Address
                </button>
            </div>
        </div>
    );
};

export default UpdateAddress;
