import { useState, ReactNode } from 'react';

interface SidebarProps {
    items: { label: string, href: string }[];
    position: string;
    children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ items, position, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div style={{
            position: 'fixed',
            [position]: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'width 0.3s ease-in-out',
            width: isCollapsed ? '50px' : '200px',
            top: "6em",
            height: '100vh',
            overflowY: 'auto'
        }}>
            <button
                onClick={toggleSidebar}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    paddingTop: '40vh',
                }}>
                {position === "left" ? (isCollapsed ? '>' : '<') : (isCollapsed ? '<' : '>')}
            </button>
            {!isCollapsed && (
                <>
                    <nav>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {items.map((item, index) => (
                                <li key={index}>
                                    <a href={item.href} style={{ color: 'white', textDecoration: 'none' }}>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {children}
                </>
            )}
        </div>
    );
};

export default Sidebar;
