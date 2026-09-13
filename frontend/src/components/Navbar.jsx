import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X, ArrowRight, Zap, Shield, Radio } from 'lucide-react';
import { sfx } from '../utils/SoundEffects';

export default function Navbar() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAudioToggle = () => {
    sfx.init();
    const next = !audioOn;
    sfx.enabled = next;
    setAudioOn(next);
    if (next) sfx.playBlip(750, 'sine', 0.1);
  };

  const handleNavAction = (path) => {
    sfx.playBlip(550, 'sine', 0.05);
    setMobileOpen(false);
    if (path) navigate(path);
  };

  return (
    <header className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
      {/* Brand Logo & Subtitle */}
      <Link to="/" className="nav-brand" onClick={() => handleNavAction('/')} aria-label="Elyvex Echo Hub">
        <div className="myth-logo-glyph-box">
          <div className="myth-glyph-wings">
            <span className="glyph-v">⟨E⟩</span>
          </div>
        </div>
        <div className="nav-brand-text">
          <span className="nav-brand-title">
            ELYVEX
          </span>
          <span className="nav-brand-subtitle">ECHO HUB // RESONANCE NETWORK</span>
        </div>
      </Link>

      {/* Navigation Routes & Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
        <div className="mobile-drawer-header">
          <div className="nav-brand-text">
            <span className="nav-brand-title">ELYVEX ECHO HUB</span>
            <span className="nav-brand-subtitle">RESONANCE NETWORK // 2079</span>
          </div>
          <button
            className="mobile-drawer-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          onClick={() => handleNavAction('/')}
        >
          ELYVEX
        </NavLink>
        <NavLink
          to="/origin"
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          onClick={() => handleNavAction('/origin')}
        >
          ORIGIN
        </NavLink>
        <NavLink
          to="/powers"
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          onClick={() => handleNavAction('/powers')}
        >
          POWERS
        </NavLink>
        <NavLink
          to="/mission"
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          onClick={() => handleNavAction('/mission')}
        >
          MISSION
        </NavLink>
        <NavLink
          to="/echo-hub"
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
          onClick={() => handleNavAction('/echo-hub')}
        >
          ECHO HUB
        </NavLink>

        <div className="mobile-drawer-footer">
          <Link
            to="/ask-elyvex"
            className="myth-cta-primary-summon mobile-drawer-cta"
            onClick={() => handleNavAction('/ask-elyvex')}
          >
            <Zap size={14} fill="currentColor" />
            <span>ASK ELYVEX FOR HELP</span>
            <ArrowRight size={14} />
          </Link>

          <button
            className="audio-toggle-btn myth-sfx-btn mobile-drawer-sfx"
            onClick={handleAudioToggle}
          >
            {audioOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>AUDIO SFX: {audioOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </nav>

      {/* Right Tools & Ask Elyvex CTA */}
      <div className="nav-right">
        {/* Signal Status Badge */}
        <div className="live-status-pill myth-signal-pill" title="Resonance Signal Active & Listening">
          <span className="live-pulse-dot" />
          <span>SIGNAL: ACTIVE</span>
        </div>

        {/* Animated Equalizer Sound Wave */}
        <div className="nav-equalizer-bars" title="Neural Core Audio Frequency">
          <span className="eq-bar eq-1" />
          <span className="eq-bar eq-2" />
          <span className="eq-bar eq-3" />
          <span className="eq-bar eq-4" />
          <span className="eq-bar eq-5" />
          <span className="eq-bar eq-6" />
        </div>

        {/* SFX Audio Toggle */}
        <button
          className="audio-toggle-btn myth-sfx-btn"
          onClick={handleAudioToggle}
          title={audioOn ? 'Mute Sound FX' : 'Enable Sound FX'}
          aria-label="Toggle Sound Effects"
        >
          {audioOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>SFX: {audioOn ? 'ON' : 'OFF'}</span>
        </button>

        {/* Red Glow Summon / Ask Elyvex Button */}
        <Link
          to="/ask-elyvex"
          className="nav-cta-btn myth-summon-btn"
          onClick={() => handleNavAction('/ask-elyvex')}
        >
          <Zap size={14} fill="currentColor" />
          <span>ASK ELYVEX</span>
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Mobile Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
