import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Footer from './components/footer';
import ServerSettings from './components/serverSettings';
import Sandbox from './sandbox/sandbox';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import CursorEffect from './components/cursorEffect';
import QuickMenu from './components/quickMenu';
import RND from './pages/RND';
import Music from './pages/Music';
import { Whitelotus } from './pages/Whitelotus';

// Define your sidebar items
const rightSideBarItems = [
  { label: 'Chat', href: '#ChatApp' },
  { label: 'Sandbox', href: '#sandbox' },
  { label: 'Iframe', href: '#Iframe' },
  { label: 'Audio Intensity', href: '#AudioIntensity' },
  { label: 'Canva Share', href: '#CanvaShare' },
];

const leftSidebarItems = [
  { label: 'Chat', href: '#ChatApp' },
  { label: 'Sandbox', href: '#sandbox' },
  { label: 'Iframe', href: '#Iframe' },
  { label: 'Audio Intensity', href: '#AudioIntensity' },
  { label: 'Canva Share', href: '#CanvaShare' },
];

// Define route components
const About = () => <h2>About</h2>;
const Contact = () => <h2>Contact</h2>;

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Store selected option
  const [showSearch, setShowSearch] = useState(false); // State for spotlight search bar
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  const options = ["Option 1", "Option 2", "Option 3"];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key down:', e.key); // Log key events

      if (e.key.toLowerCase() === "z" && !showMenu) {
        // Adjust position by the current scroll offset to ensure the menu is in the right place
        setMenuPosition({
          x: cursorPosition.x + window.scrollX,
          y: cursorPosition.y + window.scrollY,
        });
        setShowMenu(true);
      }

      // Toggle spotlight search when Shift is pressed
      if (e.key === "/") {
        setShowSearch(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log('Key up:', e.key); // Log key events
      if (e.key.toLowerCase() === "z") {
        // Select the option when Z is released
        if (selectedOption) {
          alert(`Selected: ${selectedOption}`);
        }
        setShowMenu(false);
        setSelectedOption(null);
      }

      // If Enter is pressed, submit the search and hide the search bar
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
  }, [showMenu, cursorPosition, selectedOption, searchQuery]); // Ensure updates when cursor moves or option is selected

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  return (
    <Router basename="/Sodalite">
      {/* For global features */}
      {/* <CursorEffect /> */}
      {showMenu && menuPosition && (
        <QuickMenu
          options={options}
          onSelect={(option) => setSelectedOption(option)}
          position={menuPosition}
          selectedOption={selectedOption}
        />
      )}

      {/* Spotlight Search Bar */}
      {showSearch && (
        <div style={{
          position: 'fixed', top: '150px', left: '20px', right: '20px',
          zIndex: 1000, backgroundColor: 'rgba(255, 255, 255, 0.4)', padding: '10px',
          borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <Header />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Sidebar on the left */}
          <Sidebar items={leftSidebarItems} children={<ServerSettings />} position='left' />

          {/* Main content area */}
          <div style={{ flex: 1, marginLeft: "0px", margin: '3em', marginTop: '0px', marginBottom: '0px' }}>
            <Routes >
              {/* Define your routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/music" element={<Music />} />
              <Route path="/rnd" element={<RND />} />
              <Route path="/whitelotus" element={<Whitelotus />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Sidebar on the right with Server Settings */}
          <Sidebar items={rightSideBarItems} position='right' children={<ServerSettings />} />
        </div>

        {/* Footer Section */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
