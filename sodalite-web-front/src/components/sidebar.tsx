import { useState, ReactNode } from 'react';
import { useTheme } from '../stores/hooks'; // Assuming your theme hook works the same here

interface SidebarProps {
    items: { label: string, href: string }[];
    position: 'left' | 'right';
    children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ items, position, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { theme } = useTheme();

    const isDarkMode = theme === 'dark';

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const sidebarStyle: React.CSSProperties = {
        position: 'sticky',
        [position]: 0,
        top: '6em', // Adjust this based on header height if needed
        backgroundColor: isCollapsed ? 'transparent' : (isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'),
        color: isDarkMode ? 'white' : 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCollapsed ? 'center' : 'flex-start',
        transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out',
        width: isCollapsed ? '60px' : '220px',
        height: '100vh',
        overflowY: 'auto',
        padding: isCollapsed ? '10px 0' : '20px',
        scrollbarWidth: 'thin',
        scrollbarColor: isDarkMode ? '#666 #333' : '#bbb #eee',
    };

    const toggleButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: isDarkMode ? (isCollapsed ? 'black' : 'white') : (isCollapsed ? 'black' : 'black'),
        cursor: 'pointer',
        fontSize: '20px',
        padding: '10px',
        transition: 'opacity 0.3s ease, color 0.3s ease',
        position: 'absolute',
        top: '20px',
        [position]: isCollapsed ? '10px' : '180px',
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
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                style={toggleButtonStyle}
            >
                {isCollapsed
                    ? (position === 'left' ? '▶' : '◀')
                    : (position === 'left' ? '◀' : '▶')}
            </button>

            {/* Sidebar Content */}
            {!isCollapsed && (
                <>
                    <div style={{ marginTop: 'auto', paddingBottom: '20px', width: '100%' }}>
                        {children}
                    </div>
                    <nav style={{ marginTop: '50px', width: '100%' }}>
                        <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                            {items.map((item, index) => (
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
                </>
            )}
        </div>
    );
};

export default Sidebar;
