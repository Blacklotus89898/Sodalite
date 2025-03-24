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
import { LogManager } from './logManager';
import CodeEditor from './codeEditor';
import ResizableDraggableContainer from './resizableDraggableContainer';
import ReminderCreator from './reminder';
import ScreenShare from './screenShare';
import Weather from './weather';

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
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor || ''}>
                        {collapsed ? '+' : '-'}
                    </button>
                    <h3 style={{ fontSize: baseFontSize * 1.2, display: collapsed ? 'none' : 'block' }}>Menu</h3>
                    {[
                        { key: 'dashboard', label: 'Dashboard' },
                        { key: 'profile', label: 'Profile' },
                        { key: 'settings', label: 'Settings' },
                        { key: 'notes', label: 'Notes' },
                        { key: 'iframe', label: 'Iframe' },
                        { key: 'cloud', label: 'Cloud' },
                        { key: 'canvas', label: 'Canvas' },
                        { key: 'chat', label: 'Chat' },
                        { key: 'collab', label: 'Collab' },
                        { key: 'translation', label: 'Translation' },
                        { key: 'fileshare', label: 'Filesharing' },
                        { key: 'rtc', label: 'Video Call' },
                        { key: 'timer', label: 'Timer' },
                        { key: 'audio', label: 'Audio' },
                        { key: 'comparator', label: 'Text Comparator' },
                        { key: 'Calendar', label: 'Calendar' },
                        { key: 'Contact', label: 'Contact' },
                        { key: 'Video', label: 'Video' },
                        { key: 'Log', label: 'Log' },
                        { key: 'Float', label: 'Float' },
                        { key: 'Editor', label: 'Editor' },
                        { key: 'Reminder', label: 'Reminder' },
                        { key: 'ScreenShare', label: 'ScreenShare' },
                        { key: 'Weather', label: 'Weather' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            style={activeTab === key ? activeButtonStyle : buttonStyle}
                            onClick={() => setActiveTab(key)}>
                            {collapsed ? '' : label}
                        </button>
                    ))}
             
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
                    <div style={{ display: activeTab === 'Log' ? 'flex' : 'none', flex: 1 }}>
                        <LogManager />
                    </div>
                    <div style={{ display: activeTab === 'Float' ? 'flex' : 'none', flex: 1 }}>
                        <ResizableDraggableContainer />
                    </div>
                    <div style={{ display: activeTab === 'Editor' ? 'flex' : 'none', flex: 1 }}>
                        <CodeEditor />
                    </div>
                    <div style={{ display: activeTab === 'Reminder' ? 'flex' : 'none', flex: 1 }}>
                        <ReminderCreator />
                    </div>
                    <div style={{ display: activeTab === 'ScreenShare' ? 'flex' : 'none', flex: 1 }}>
                        <ScreenShare />
                    </div>
                    <div style={{ display: activeTab === 'Weather' ? 'flex' : 'none', flex: 1 }}>
                        <Weather />
                    </div>

                </div>
            </div>
        </Container>
    );
};

export default PersistentLayout;
