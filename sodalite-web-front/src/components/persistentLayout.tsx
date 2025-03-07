import React, { useState } from 'react';

// Define all possible child components
const Profile = () => {
    const [count, setCount] = React.useState(0);  // State should persist
    return (
        <div>
            <h2>Profile Page</h2>
            <p>Counter: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
};

const Settings = () => {
    const [darkMode, setDarkMode] = React.useState(false);  // State should persist
    return (
        <div>
            <h2>Settings Page</h2>
            <label>
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                Dark Mode
            </label>
        </div>
    );
};

const Dashboard = () => {
    return <div><h2>Dashboard Page</h2></div>;
};

// Parent layout with sidebar menu
const PersistentLayout: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'settings'>('dashboard');

    // Child components are rendered *once* and hidden/shown using CSS or simple logic.
    // They are not unmounted/re-mounted.
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar Menu */}
            <div style={{ width: '200px', background: '#eee', padding: '10px' }}>
                <h3>Menu</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li><button onClick={() => setActiveTab('dashboard')}>Dashboard</button></li>
                    <li><button onClick={() => setActiveTab('profile')}>Profile</button></li>
                    <li><button onClick={() => setActiveTab('settings')}>Settings</button></li>
                </ul>
            </div>

            {/* Main content area - we just switch visibility, not remount */}
            <div style={{ flex: 1, padding: '20px' }}>
                <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
                    <Dashboard />
                </div>
                <div style={{ display: activeTab === 'profile' ? 'block' : 'none' }}>
                    <Profile />
                </div>
                <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
                    <Settings />
                </div>
            </div>
        </div>
    );
};

export default PersistentLayout;
