import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../stores/hooks';
import { Container } from './container';
import PersistentNotebookLayout from './notebook';
import { CanvaShare } from './canvaShare';
import Iframe from './iframe';
import ProfileComponent from './profile';
import FileUploadComponent from './fileUploadComponent';
import {ChatApp} from './chatApp'; // Add this line
import CollabApp from './collabApp';
import TranslationComponent from './translationComponent';
import FileShare from './wsFileSharing';
import ManualRTC from './manualRTC';
import UpdateAddress from './serverSettings';
import Timer from './timer';
import { AudioIntensity } from './audioIntensity';
import TextComparator from './textComparator';
import CalendarPicker from './calendarPicker';
import ContactBook from './contactBook';
import WebcamStream from './webcamStream';

// Child components (you can replace these with your real components)
const Dashboard = () => <div>Dashboard Content</div>;

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
        height: '90vh',
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
        overflowY: 'auto',
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
        <Container maxWidth={1600} maxHeight={1200}>
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
                    <button
                        style={activeTab === 'canvas' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('canvas')}
                    >
                        {collapsed ? '' : 'Canvas'}
                    </button>
                    <button
                        style={activeTab === 'chat' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('chat')}
                    >
                        {collapsed ? '' : 'Chat'}
                    </button>
                    <button
                        style={activeTab === 'collab' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('collab')}
                    >
                        {collapsed ? '' : 'Collab'}
                    </button>
                    <button
                        style={activeTab === 'translation' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('translation')}
                    >
                        {collapsed ? '' : 'Translation'}
                    </button>
                    <button
                        style={activeTab === 'fileshare' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('fileshare')}
                    >
                        {collapsed ? '' : 'Filesharing'}
                    </button>
                    <button
                        style={activeTab === 'rtc' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('rtc')}
                    >
                        {collapsed ? '' : 'Video Call'}
                    </button>
                    <button
                        style={activeTab === 'timer' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('timer')}
                    >
                        {collapsed ? '' : 'Timer'}
                    </button>
                    <button
                        style={activeTab === 'audio' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('audio')}
                    >
                        {collapsed ? '' : 'Audio'}
                    </button>
                    <button
                        style={activeTab === 'comparator' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('comparator')}
                    >
                        {collapsed ? '' : 'Text Comparator'}
                    </button>
                    <button
                        style={activeTab === 'Calendar' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('Calendar')}
                    >
                        {collapsed ? '' : 'Calendar'}
                    </button>
                    <button
                        style={activeTab === 'Contact' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('Contact')}
                    >
                        {collapsed ? '' : 'Contact'}
                    </button>
                    <button
                        style={activeTab === 'Video' ? activeButtonStyle : buttonStyle}
                        onClick={() => setActiveTab('Video')}
                    >
                        {collapsed ? '' : 'Video'}
                    </button>
                </div>

                {/* Main Content Area */}
                <div style={contentStyle}>
                    <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
                        <Dashboard />
                    </div>
                    <div style={{ display: activeTab === 'profile' ? 'flex' : 'none', flex: 1 }}>
                        <ProfileComponent />
                    </div>
                    {/* </div> */}
                    <div style={{ display: activeTab === 'settings' ? 'flex' : 'none', flex: 1 }}>
                        <UpdateAddress />
                    </div>
                    <div style={{ display: activeTab === 'notes' ? 'flex' : 'none', flex: 1 }}>
                        <PersistentNotebookLayout />
                    </div>
                    <div style={{ display: activeTab === 'iframe' ? 'flex' : 'none', flex: 1 }}>
                        <Iframe initialLink="https://wikipedia.com" name="Example" />
                    </div>
                    <div style={{ display: activeTab === 'cloud' ? 'flex' : 'none', flex: 1 }}>
                        <FileUploadComponent />
                    </div>
                    <div style={{ display: activeTab === 'canvas' ? 'flex' : 'none', flex: 1 }}>
                        <CanvaShare />
                    </div>
                    <div style={{ display: activeTab === 'chat' ? 'flex' : 'none', flex: 1 }}>
                        <ChatApp />
                    </div>
                    <div style={{ display: activeTab === 'collab' ? 'flex' : 'none', flex: 1 }}>
                        <CollabApp />
                    </div>
                    <div style={{ display: activeTab === 'translation' ? 'flex' : 'none', flex: 1 }}>
                        <TranslationComponent/>
                    </div>
                    <div style={{ display: activeTab === 'fileshare' ? 'flex' : 'none', flex: 1 }}>
                        <FileShare  websocketUrl='ws://192.168.0.103:8080'/>
                    </div>
                    <div style={{ display: activeTab === 'rtc' ? 'flex' : 'none', flex: 1 }}>
                        <ManualRTC />
                    </div>
                    <div style={{ display: activeTab === 'timer' ? 'flex' : 'none', flex: 1 }}>
                        <Timer 
                        initialTime={60}
                        />
                    </div>
                    <div style={{ display: activeTab === 'audio' ? 'flex' : 'none', flex: 1 }}>
                        <AudioIntensity />
                    </div>
                    <div style={{ display: activeTab === 'comparator' ? 'flex' : 'none', flex: 1 }}>
                        <TextComparator />
                    </div>
                    <div style={{ display: activeTab === 'Calendar' ? 'flex' : 'none', flex: 1 }}>
                        <CalendarPicker />
                    </div>
                    <div style={{ display: activeTab === 'Contact' ? 'flex' : 'none', flex: 1 }}>
                        <ContactBook />
                    </div>
                    <div style={{ display: activeTab === 'Video' ? 'flex' : 'none', flex: 1 }}>
                        <WebcamStream />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default PersistentLayout;
