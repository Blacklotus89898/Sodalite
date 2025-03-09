import { useState, ReactNode } from 'react';
import { useTheme, useEvent } from '../stores/hooks'; // Assuming your theme hook works the same here

interface SidebarProps {
    items: { label: string, href: string }[];
    position: 'left' | 'right';
    children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ items, position, children }) => {
    // const [events['lsidebar'], setEvent] = useState(true);
    const {events, setEvent} = useEvent();
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const toggleSidebar = () => setEvent("lsidebar", !events['lsidebar']);

    const sidebarStyle: React.CSSProperties = {
        position: 'sticky',
        [position]: 0,
        top: "6em",
        backgroundColor: events['lsidebar'] ? 'transparent' : (isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'),
        color: isDarkMode ? 'white' : 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: events['lsidebar'] ? 'center' : 'flex-start',
        transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out',
        width: events['lsidebar'] ? '60px' : '420px',
        height: '100vh',
        overflowY: 'auto',
        padding: events['lsidebar'] ? '10px 0' : '20px',
        scrollbarWidth: 'thin',
        scrollbarColor: isDarkMode ? '#666 #333' : '#bbb #eee',
        zIndex: 1000,
    };

    const toggleButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: isDarkMode ? (events['lsidebar'] ? 'black' : 'white') : (events['lsidebar'] ? 'black': "black"),
        cursor: 'pointer',
        fontSize: '20px',
        padding: '10px',
        transition: 'opacity 0.3s ease, color 0.3s ease',
        position: 'absolute',
        top: '10px',
        left: position === 'left' ? '10px' : 'auto',
        right: position === 'right' ? '10px' : 'auto',
    };

    const linkStyle: React.CSSProperties = {
        color: isDarkMode ? 'white' : 'black',
        textDecoration: 'none',
        padding: '10px',
        display: 'block',
        borderRadius: '5px',
        transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
    };

    const hoverBackground = isDarkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.1)';

    return (
        <div style={sidebarStyle}>
            {/* Toggle Button - Always at the Top */}
            <button
                onClick={toggleSidebar}
                style={toggleButtonStyle}
            >
                {events['lsidebar']
                    ? (position === 'left' ? '▶' : '◀')
                    : (position === 'left' ? '◀' : '▶')}
            </button>

            {/* Sidebar Content */}
            {!events['lsidebar'] && (
                <>
                <div>

                        {items.length > 0 && (
                    <nav style={{ marginTop: '50px', width: '100%' }}>
                        <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                            {items.map((item: { label: string, href: string }, index: number) => (
                                <li key={index} style={{ margin: '10px 0', textAlign: 'center' }}>
                                    <a
                                        href={item.href}
                                        style={linkStyle}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverBackground}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                        )}
                </div>

                    <div style={{ marginTop: 'auto', paddingBottom: '20px', width: '100%' }}>
                        {children}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
