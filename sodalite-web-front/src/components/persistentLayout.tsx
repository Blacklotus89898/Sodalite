import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../stores/hooks';
import { Container } from './container';
import PersistentNotebookLayout from './notebook';
import { CanvaShare } from './canvaShare';
import Iframe from './iframe';
import ProfileComponent from './profile';
import FileUploadComponent from './fileUploadComponent';

// Child components (you can replace these with your real components)
const Dashboard = () => <div>Dashboard Content</div>;
const Settings = () => <div>Settings Content</div>;

const PersistentLayout: React.FC = () => {
    const { theme, chroma } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(400);
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [collapsed, setCollapsed] = useState(false); // State for collapsible sidebar

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const isDarkMode = theme === 'dark';

    const baseFontSize = Math.min(24, Math.max(12, width * 0.05));
    const sidebarWidth = collapsed ? 30 : Math.max(150, width * 0.3); // Sidebar width based on collapsed state

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        height: '100vh',
        backgroundColor: isDarkMode ? '#121212' : '#f7f7f7',
        color: isDarkMode ? 'white' : 'black',
        fontSize: baseFontSize,
    };

    const sidebarStyle: React.CSSProperties = {
        width: sidebarWidth,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '15px',
        boxShadow: isDarkMode ? '2px 0 10px rgba(0, 0, 0, 0.5)' : '2px 0 10px rgba(200, 200, 200, 0.5)',
        transition: 'width 0.3s ease', // Smooth transition for collapsing/expanding
    };

    const buttonStyle: React.CSSProperties = {
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        border: 'none',
        color: isDarkMode ? 'white' : 'black',
        cursor: 'pointer',
        transition: 'background 0.3s ease, color 0.3s ease',
        fontSize: baseFontSize * 0.9,
        textAlign: 'left',
        whiteSpace: 'nowrap', // Prevent text wrapping in buttons
    };

    const activeButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: chroma,
        color: isDarkMode ? 'black' : 'white',
    };
    const contentStyle: React.CSSProperties = {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        transition: 'margin-left 0.3s ease',
        display: 'flex', // Add this line
        flexDirection: 'column', // Add this line
    };
    

    return (
        <Container maxWidth={1200} maxHeight={800}>
            <div ref={containerRef} style={containerStyle}>
                {/* Sidebar */}
                <div style={sidebarStyle}>
                    {/* Collapsible Toggle Button */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ ...buttonStyle, marginBottom: '15px', textAlign: 'center' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = chroma}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor || ''}
                    >
                        {collapsed ? '+' : '-'}
                    </button>
                    <h3 style={{ fontSize: baseFontSize * 1.2, display: collapsed ? 'none' : 'block' }}>Menu</h3>
                    <button
                        style={activeTab === 'dashboard' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('dashboard')}

                    >
                        {collapsed ? '' : 'Dashboard'}
                    </button>
                    <button
                        style={activeTab === 'profile' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('profile')}
                    >
                        {collapsed ? '' : 'Profile'}
                    </button>
                    <button
                        style={activeTab === 'settings' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('settings')}
                    >
                        {collapsed ? '' : 'Settings'}
                    </button>
                    <button
                        style={activeTab === 'notes' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('notes')}
                    >
                        {collapsed ? '' : 'Notes'}
                    </button>
                    <button
                        style={activeTab === 'iframe' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('iframe')}
                    >
                        {collapsed ? '' : 'Iframe'}
                    </button>
                    <button
                        style={activeTab === 'cloud' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('cloud')}
                    >
                        {collapsed ? '' : 'Cloud'}
                    </button>
                </div>

                {/* Main Content Area */}
                <div style={contentStyle}>
                    <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
                        <Dashboard />
                    </div>
                    {/* <div style={{ display: activeTab === 'profile' ? 'block' : 'none' }}> */}
                    <div style={{ display: activeTab === 'profile' ? 'flex' : 'none', flex: 1 }}>
    <ProfileComponent />
</div>
                    {/* </div> */}
                    <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
                        <Settings />
                    </div>
                    <div style={{ display: activeTab === 'notes' ? 'flex' : 'none', flex: 1 }}>
                        <PersistentNotebookLayout />
                        {/* <div>   </div> */}
                        {/* <CanvaShare /> */}
                    </div>
                    <div style={{ display: activeTab === 'iframe' ? 'flex' : 'none', flex: 1 }}>
                        {/* <Iframe initialLink="https://wikipedia.com" name="iframe" /> */}
                        <Iframe initialLink="https://wikipedia.com" name="Example" />

                    </div>
                    <div style={{ display: activeTab === 'cloud' ? 'flex' : 'none', flex: 1 }}>
                        {/* <Iframe initialLink="https://wikipedia.com" name="iframe" /> */}
                        <FileUploadComponent />

                    </div>
                </div>
            </div>
        </Container>
    );
};

export default PersistentLayout;
