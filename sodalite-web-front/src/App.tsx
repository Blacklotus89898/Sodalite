import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Footer from './components/footer';
import ServerSettings from './components/serverSettings';
import Sandbox from './sandbox/sandbox';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import RND from './pages/RND';
import Music from './pages/Music';
import { Whitelotus } from './pages/Whitelotus';
import './App.css';
import Sodalite from './pages/Sodalite';
import EventController from './components/eventController';

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
  return (
    <Router basename="/Sodalite">

      <EventController />

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
              <Route path="/" element={<Sodalite />} />
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
