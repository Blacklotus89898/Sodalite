import React, { useState } from 'react';
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

    return (
        <div>
            <h3>Current Address:</h3>
            <pre>{JSON.stringify(address, null, 2)}</pre>
            <div>
                <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter server key (e.g., server1)"
                />
                <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter new address"
                />
                <button onClick={handleUpdate}>Update Address</button>
            </div>
        </div>
    );
};

export default UpdateAddress;
