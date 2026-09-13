import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import './styles.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleCanvas from './components/ParticleCanvas';

import HomePage from './pages/HomePage';
import OriginPage from './pages/OriginPage';
import PowersPage from './pages/PowersPage';
import MissionPage from './pages/MissionPage';
import EchoHubPage from './pages/EchoHubPage';
import AskElyvexPage from './pages/AskElyvexPage';
import ContactPage from './pages/ContactPage';

// Scroll to top helper on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Background Visual FX */}
        <ParticleCanvas />
        <div className="cyber-grid-overlay" aria-hidden="true" />
        <div className="vignette-overlay" aria-hidden="true" />

        {/* Scroll Helper */}
        <ScrollToTop />

        {/* Fixed Glass Navigation */}
        <Navbar />

        {/* Route Outlets */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/origin" element={<OriginPage />} />
          <Route path="/powers" element={<PowersPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/echo-hub" element={<EchoHubPage />} />
          <Route path="/ask-elyvex" element={<AskElyvexPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>

        {/* Global Futuristic Command Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
