import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Eye, Cpu, BrainCircuit, HeartPulse, Sparkles, Radio,
  Flame, Terminal, Layers, AlertTriangle, Sparkle, ArrowRight,
  Filter, Shield, Wind, Wrench, Orbit, CloudLightning, Heart,
  CheckCircle, User
} from 'lucide-react';
import { powersData, superheroSpec } from '../data/powersData';
import PowerModal from '../components/PowerModal';
import { sfx } from '../utils/SoundEffects';

export default function PowersPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPower, setSelectedPower] = useState(null);

  const categories = ['All', 'Sensory', 'Kinetic', 'Defensive', 'Offensive', 'Empathic', 'Utility', 'Dangerous & Ultimate'];

  const filteredPowers = powersData.filter((power) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Dangerous & Ultimate') return power.special === true || power.category === 'Dangerous & Ultimate';
    return power.category === activeCategory;
  });

  const handleCardClick = (power) => {
    sfx.playBlip(700, 'sine', 0.08);
    setSelectedPower(power);
  };

  const handleCategorySelect = (cat) => {
    sfx.playBlip(550, 'sine', 0.05);
    setActiveCategory(cat);
  };

  return (
    <div className="page-wrapper" aria-label="Elyvex Powers & Tactical Arsenal">
      {/* Header Banner */}
      <section className="page-header-section">
        <div className="section-eyebrow">
          <Zap size={14} />
          <span>NEURAL CORE ARSENAL // {powersData.length} CAPABILITIES</span>
        </div>
        <h1 className="page-title-main">
          Her <span className="cyan-text">Powers.</span>
        </h1>
        <p className="page-lead-subtitle">
          The Neural Core bridges human empathy with machine intelligence. Every ability is calibrated to defend human lives, neutralize automated threats, and carry burdens when words fail.
        </p>

        {/* Category Filter Pills */}
        <div className="powers-filter-bar" role="tablist" aria-label="Power Categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Power Cards */}
      <section className="site-section" style={{ paddingTop: '20px' }}>
        <div className="powers-grid-container">
          {filteredPowers.map((power, idx) => {
            const IconComp = power.icon;
            return (
              <div
                key={power.id}
                className={`power-hologram-card ${power.special ? 'special-dark' : ''}`}
                onClick={() => handleCardClick(power)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(power);
                  }
                }}
                aria-label={`View diagnostic dossier for ${power.name}`}
              >
                <div className="power-card-top">
                  <div className="power-icon-wrapper">
                    <IconComp size={24} />
                  </div>
                  <span className="power-card-index">0{idx + 1}</span>
                </div>

                <div className="power-card-content">
                  <h3>{power.name}</h3>
                  <p>{power.summary}</p>
                </div>

                <div className="power-card-bottom-info">
                  <div className="power-card-tier-badge">
                    <Sparkle size={12} />
                    <span>{power.tier}</span>
                  </div>
                  <span className="power-card-energy-pill">
                    {power.energy}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hero Character & Costume Specification Matrix */}
      <section className="site-section">
        <div className="section-header-block">
          <div className="section-eyebrow">
            <User size={14} />
            <span>HERO ARCHITECTURE & SPECIFICATIONS</span>
          </div>
          <h2 className="section-title">
            Hero Profile & <span className="cyan-text">Costume Details</span>
          </h2>
          <p className="section-description">
            Engineered with quantum conduits and nanotech armor plating to withstand extreme physical and electromagnetic forces.
          </p>
        </div>

        <div className="hero-spec-grid">
          {/* Identity & Personality Card */}
          <div className="spec-card-box">
            <div className="spec-card-header">
              <span className="spec-tag">HERO IDENTITY</span>
              <h3>ELYVEX</h3>
            </div>
            <div className="spec-attributes-list">
              <div className="spec-attr-row">
                <span className="attr-label">REAL IDENTITY:</span>
                <span className="attr-val">Dr. Aven Elyvex (AI Researcher)</span>
              </div>
              <div className="spec-attr-row">
                <span className="attr-label">AGE:</span>
                <span className="attr-val">20 (approx.)</span>
              </div>
              <div className="spec-attr-row">
                <span className="attr-label">BUILD:</span>
                <span className="attr-val">Athletic & Lean</span>
              </div>
              <div className="spec-attr-row">
                <span className="attr-label">HAIR:</span>
                <span className="attr-val">Long dark, slightly wavy</span>
              </div>
              <div className="spec-attr-row">
                <span className="attr-label">EYES:</span>
                <span className="attr-val">Expressive (electric cyan glow under load)</span>
              </div>
            </div>

            <div className="personality-traits-wrap">
              <div className="trait-title">CORE PERSONALITY</div>
              <div className="traits-chips-grid">
                {superheroSpec.hero.personality.map((trait, tIdx) => (
                  <span key={tIdx} className="trait-chip">
                    <Heart size={12} color="#00f0ff" />
                    <span>{trait}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Costume & Hardware Specs */}
          <div className="spec-card-box">
            <div className="spec-card-header">
              <span className="spec-tag">SUIT HARDWARE</span>
              <h3>Costume & Conduits</h3>
            </div>
            <div className="costume-parts-grid">
              {superheroSpec.hero.costume.map((item, cIdx) => (
                <div key={cIdx} className="costume-item-tile">
                  <div className="costume-tile-head">
                    <Zap size={14} color="#00f0ff" />
                    <strong>{item.part}</strong>
                  </div>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="color-palette-spec-row">
              <div className="trait-title">SIGNATURE PALETTE</div>
              <div className="color-swatches-grid">
                {superheroSpec.hero.colors.map((col, colIdx) => (
                  <div key={colIdx} className="swatch-item">
                    <span className="swatch-circle" style={{ background: col.hex, border: col.hex === '#020611' ? '1px solid #38bdf8' : 'none' }} />
                    <div className="swatch-text">
                      <strong>{col.name}</strong>
                      <small>{col.desc}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Power Highlight: Dark Echo & Total Echo */}
      <section className="site-section special-powers-spotlight">
        <div className="section-header-block">
          <div className="section-eyebrow" style={{ color: '#d8b4fe' }}>
            <AlertTriangle size={14} />
            <span>CRITICAL RISK & ULTIMATE CONVERGENCE</span>
          </div>
          <h2 className="section-title">
            The Cost of <span style={{ color: '#c084fc' }}>Limitless Power</span>
          </h2>
          <p className="section-description">
            The Neural Core is not a magical machine. It carries real physical and somatic weight.
          </p>
        </div>

        <div className="special-powers-duo-grid">
          {/* Dark Echo Card */}
          <div className="special-power-banner dark-echo-banner">
            <div className="special-power-icon">
              <Flame size={32} color="#f43f5e" />
            </div>
            <div className="special-power-info">
              <span className="special-tag-warn">FORBIDDEN OVERCLOCK // DARK ECHO</span>
              <h3>She Carries What Others Can't</h3>
              <p>
                Every memory Elyvex enters and every agonizing pain she absorbs from victims leaves traces inside the Neural Core. When facing apocalyptic threats, unleashing Dark Echo grants overwhelming combat power, but risks corrupting her neural link.
              </p>
              <div className="hazard-indicator">
                <span className="hazard-dot" />
                <span>RISK LEVEL: 90% SOMATIC OVERLOAD</span>
              </div>
            </div>
          </div>

          {/* Total Echo Card */}
          <div className="special-power-banner total-echo-banner">
            <div className="special-power-icon">
              <Zap size={32} color="#00f0ff" />
            </div>
            <div className="special-power-info">
              <span className="special-tag-ultimate">ULTIMATE ABILITY // TOTAL ECHO</span>
              <h3>Absolute Harmonic Convergence</h3>
              <p>
                The pinnacle of Elyvex’s abilities. Total Echo harmonizes all connected network nodes into a single uncrackable frequency. It was this power that dismantled AETHER in 2079 without harming human minds.
              </p>
              <div className="hazard-indicator" style={{ color: '#00f0ff' }}>
                <span className="hazard-dot" style={{ background: '#00f0ff', boxShadow: '0 0 10px #00f0ff' }} />
                <span>FREQUENCY: PLANETARY 100% RESONANCE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section className="site-section">
        <div className="mission-philosophy-banner">
          <div className="philosophy-text-block">
            <h3>
              "Power is meaningless<br />
              <em>unless it protects someone in need."</em>
            </h3>
            <p>If you are facing a crisis or technological threat, Elyvex is ready to deploy her abilities.</p>
          </div>
          <Link
            to="/ask-elyvex"
            className="cta-primary-hero"
            onClick={() => sfx.playBlip(650, 'triangle', 0.08)}
          >
            <span>TALK TO ELYVEX</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Diagnostic Modal */}
      {selectedPower && (
        <PowerModal power={selectedPower} onClose={() => setSelectedPower(null)} />
      )}
    </div>
  );
}
