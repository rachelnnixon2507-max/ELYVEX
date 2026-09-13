import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Radio, Heart } from 'lucide-react';
import { sfx } from '../utils/SoundEffects';

export default function Footer() {
  const handleClick = () => {
    sfx.playBlip(550, 'sine', 0.05);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" aria-label="Site Footer">
      <div className="footer-top-row">
        <div className="footer-brand-lockup">
          <div className="nav-logo-glyph" style={{ width: '36px', height: '36px' }}>
            <span className="nav-logo-letter" style={{ fontSize: '15px' }}>E</span>
          </div>
          <div>
            <strong style={{ fontFamily: 'var(--font-hud)', fontSize: '17px', color: '#ffffff', letterSpacing: '0.15em', display: 'block' }}>
              ECHO HUB // ELYVEX
            </strong>
            <div className="footer-tagline-quote">
              "Someone needs help. I'm already listening."
            </div>
          </div>
        </div>

        <ul className="footer-nav-links" aria-label="Footer Navigation">
          <li><Link to="/" onClick={handleClick}>ELYVEX</Link></li>
          <li><Link to="/origin" onClick={handleClick}>ORIGIN</Link></li>
          <li><Link to="/powers" onClick={handleClick}>POWERS</Link></li>
          <li><Link to="/mission" onClick={handleClick}>MISSION</Link></li>
          <li><Link to="/echo-hub" onClick={handleClick}>ECHO HUB</Link></li>
          <li><Link to="/ask-elyvex" onClick={handleClick}>ASK ELYVEX</Link></li>
          <li><Link to="/contact" onClick={handleClick}>EMERGENCY</Link></li>
        </ul>
      </div>

      <div className="footer-middle-quote">
        <div className="quote-badge">CORE PHILOSOPHY</div>
        <p>"Technology should never make people powerless."</p>
      </div>

      <div className="footer-bottom-row">
        <div className="footer-status-indicator">
          <span className="live-pulse-dot" />
          <span>NEURAL CORE STATUS: ONLINE // QUANTUM-4 ENCRYPTED</span>
        </div>
        <div className="footer-copyright">
          &copy; 2079 ELYVEX ECHO NETWORK. ALL HUMAN RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
