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

  const options = ["Option 1", "Option 2", "Option 3"];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "z" && !showMenu) {
        // Adjust position by the current scroll offset to ensure the menu is in the right place
        setMenuPosition({
          x: cursorPosition.x + window.scrollX,
          y: cursorPosition.y + window.scrollY,
        });
        setShowMenu(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "z") {
        // Select the option when Z is released
        if (selectedOption) {
          alert(`Selected: ${selectedOption}`);
        }
        setShowMenu(false);
        setSelectedOption(null);
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
  }, [showMenu, cursorPosition, selectedOption]); // Ensure updates when cursor moves or option is selected

  return (
    <Router basename="/Sodalite">
      {/* For global features */}
      <CursorEffect />
      {showMenu && menuPosition && (
        <QuickMenu
          options={options}
          onSelect={(option) => setSelectedOption(option)}
          position={menuPosition}
          selectedOption={selectedOption}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <Header />

        <div style={{ display: 'flex', flex: 1 }}>
          {/* Sidebar on the left */}
          <Sidebar items={leftSidebarItems} children={<ServerSettings />} position='left' />

          {/* Main content area */}
          <div style={{ flex: 1, margin: '3em', marginTop: '0px' }}>
            <Routes >
              {/* Define your routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/rnd" element={<RND />} />
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
