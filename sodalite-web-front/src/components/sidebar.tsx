import { useState, ReactNode } from 'react';

interface SidebarProps {
    items: { label: string, href: string }[];
    position: 'left' | 'right';
    children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ items, position, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div style={{
            position: 'sticky', // Makes the sidebar sticky
            [position]: 0,
            top: '6em', // Adjust this to the height of your header to control where it sticks
            backgroundColor: isCollapsed ? 'transparent' : 'rgba(0, 0, 0, 0.95)',  // Transparent when collapsed
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isCollapsed ? 'center' : 'flex-start',
            transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out',
            width: isCollapsed ? '60px' : '220px',
            height: '100vh',
            overflowY: 'auto',
            padding: isCollapsed ? '10px 0' : '20px',
        }}>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                style={{
                    background: 'none',
                    border: 'none',
                    color: isCollapsed ? 'black' : 'white',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '10px',
                    transition: 'opacity 0.3s ease',
                    position: 'absolute',
                    top: '20px',
                    [position]: isCollapsed ? '10px' : '180px', // Adjust position dynamically
                }}
            >
                {isCollapsed ? (position === "left" ? '▶' : '◀') : (position === "left" ? '◀' : '▶')}
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
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                            padding: '10px',
                                            display: 'block',
                                            borderRadius: '5px',
                                            transition: 'background 0.3s ease-in-out',
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
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
