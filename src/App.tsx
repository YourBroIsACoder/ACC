// App.tsx

import { useState, useEffect } from 'react';
import Background3D from './components/Background3D';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Newsletter from './components/Newsletter';
import Announcements from './components/Announcements';
import Team from './components/Team';
import Events from './components/Events';
import Contact from './components/Contact';
import Footer from './components/Footer';
import JoinUs from './components/JoinUs';
import Admin from './pages/admin';

// --- NEW: Import the PastEventPage component ---
import PastEventPage from './components/PastEventPage'; 

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const getSectionFromPath = (path: string) => {
    return path.slice(1) || 'home';
  };

  useEffect(() => {
    const initialSection = getSectionFromPath(window.location.pathname);
    setActiveSection(initialSection);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const newSection = getSectionFromPath(window.location.pathname);
      setActiveSection(newSection);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);


  const renderSection = () => {
    // --- NEW: Check for a dynamic event route FIRST ---
    if (activeSection.startsWith('event/')) {
      // If the path is "event/101", split it and get the "101" part
      const eventId = activeSection.split('/')[1];
      // Render the detail page and pass the ID as a prop
      return <PastEventPage id={eventId} setActiveSection={setActiveSection} />;
    }

    // If it's not an event route, use the normal switch statement
    switch (activeSection) {
      case 'home':
        return <><Hero setActiveSection={setActiveSection} /><Announcements /></>;
      case 'about':
        return <About />;
      case 'team':
        return <Team />;
      // --- IMPORTANT: Pass setActiveSection down to Events ---
      case 'events':
        return <Events setActiveSection={setActiveSection} />;
      case 'admin':
        return <Admin />;
      case 'contact':
        return <Contact />;
      case 'newsletter':
        return <Newsletter />;
      case 'join-us': // Make sure this matches the string used in Header/Hero
        return <JoinUs />;
      default:
        return <><Hero setActiveSection={setActiveSection} /><Announcements /></>;
    }
  };

  return (
  <div className="bg-gray-800 min-h-screen">
      <Background3D />
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="relative z-10">{renderSection()}</main>
      <Footer />
    </div>
  );
}

export default App;