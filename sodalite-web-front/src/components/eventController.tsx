import { useState, useEffect, useRef } from 'react';
import QuickMenu from './quickMenu';
import SpacebarModal from './shortcut';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../stores/hooks';

interface SearchBarProps {
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchQuery: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchQuery, searchQuery }) => {
    const { theme } = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.target.value.replace(/\//g, ''); // Remove '/' character
        setSearchQuery(value);
    };

    return (
        <div style={{
            position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 1000, backgroundColor: theme === 'dark' ? '#333' : 'rgba(255, 255, 255, 0.9)', padding: '10px',
            borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', width: '80%', maxWidth: '600px'
        }}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                    width: '96%', padding: '10px', fontSize: '16px', borderRadius: '4px', margin: 'auto',
                    border: '1px solid #ccc', backgroundColor: theme === 'dark' ? '#555' : '#fff',
                    color: theme === 'dark' ? '#fff' : '#000'
                }}
            />
        </div>
    );
}

const EventController: React.FC = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { setTheme, theme } = useTheme();
    const [showModal, setshowModal] = useState(false);


    const options = ["Sodalite", "Dashboard", "Theme", "Header", "Sidebar", "Kali"];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            console.log('Key down:', e.key);
            
            const target = e.target as HTMLElement;
            if (!showSearch && target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

            
            if (e.key === "/") {
                setShowSearch(prev => !prev);
            }
            
            if (e.code === "Space" && !showSearch) {
                setshowModal((prev) => !prev);
                e.preventDefault(); // Prevent page scrolling
              }
            
            if (e.key.toLowerCase() === "z" && !showMenu && !showSearch) {
                setMenuPosition({
                    x: cursorPosition.x + window.scrollX,
                    y: cursorPosition.y + window.scrollY,
                });
                setShowMenu(true);
            }

        };

        const handleKeyUp = (e: KeyboardEvent) => {
            console.log('Key up:', e.key);

            const target = e.target as HTMLElement;
            if (!showSearch && target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

                if (e.key.toLowerCase() === "z" && !showSearch) {
                    if (selectedOption) {
                        switch (selectedOption) {
                            case "Sodalite":
                                navigate('/');
                                break;
                            case "Dashboard":
                                navigate('/dashboard');
                                break;
                            case "Theme":
                                setTheme(theme === 'dark' ? 'light' : 'dark');
                                break;
                            default:
                                break;
                        }
                    }
                    setShowMenu(false);
                    setSelectedOption(null);
            }


            if (e.key === "Enter" && showSearch) {
                alert(`Search submitted: ${searchQuery}`);
                setShowSearch(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [showMenu, cursorPosition, selectedOption, searchQuery]);

    return (
        <>
        {showModal &&
             <SpacebarModal />
        }
            {showMenu && menuPosition && (
                <QuickMenu
                    options={options}
                    onSelect={(option) => setSelectedOption(option)}
                    position={menuPosition}
                    selectedOption={selectedOption}
                />
            )}

            {showSearch && (
                <SearchBar setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
            )}
        </>
    );
};

export default EventController;
