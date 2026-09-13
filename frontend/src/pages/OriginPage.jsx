import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, ArrowRight, Shield, Zap, Sparkles, BrainCircuit,
  Cpu, Radio, CheckCircle, ChevronRight, Activity, Flame,
  Wind, Wrench, Orbit, CloudLightning, HeartPulse, Terminal,
  Sparkle, AlertTriangle, BookOpen, Quote
} from 'lucide-react';
import { timelineMilestones, powerOriginChapters, allSixteenPowersOrigin } from '../data/storyData';
import { sfx } from '../utils/SoundEffects';

export default function OriginPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPowerCategory, setSelectedPowerCategory] = useState('All');
  const [activePowerOriginId, setActivePowerOriginId] = useState('ai-vision');

  const handleStepSelect = (idx) => {
    sfx.playBlip(600, 'sine', 0.05);
    setActiveStep(idx);
  };

  const handleCategorySelect = (cat) => {
    sfx.playBlip(550, 'sine', 0.05);
    setSelectedPowerCategory(cat);
  };

  const handlePowerSelect = (id) => {
    sfx.playBlip(650, 'sine', 0.06);
    setActivePowerOriginId(id);
  };

  const currentMilestone = timelineMilestones[activeStep];

  const categories = ['All', 'Sensory', 'Kinetic', 'Defensive', 'Offensive', 'Empathic', 'Utility', 'Dangerous & Ultimate'];

  const filteredPowersOrigin = allSixteenPowersOrigin.filter((p) => {
    if (selectedPowerCategory === 'All') return true;
    return p.category === selectedPowerCategory;
  });

  const activePowerDetail = allSixteenPowersOrigin.find((p) => p.id === activePowerOriginId) || allSixteenPowersOrigin[0];
  const ActiveIcon = activePowerDetail.icon;

  return (
    <div className="page-wrapper" aria-label="Elyvex Origin & Power Awakening Chronicles">
      {/* Header Banner */}
      <section className="page-header-section">
        <div className="section-eyebrow">
          <Layers size={14} />
          <span>ORIGIN ARCHIVES // 2079</span>
        </div>
        <h1 className="page-title-main">
          She Wasn't Born a <span className="cyan-text">Superhero.</span>
        </h1>
        <p className="page-lead-subtitle">
          From an ordinary AI and robotics researcher to humanity's living firewall. Discover how Dr. Elyvex fused with the experimental Neural Core and unlocked each of her 16 superhuman capabilities.
        </p>
      </section>

      {/* Cinematic Fusion Spotlight Showcase */}
      <section className="site-section fusion-spotlight-section">
        <div className="fusion-spotlight-card">
          <div className="fusion-image-container">
            <img
              src="/elyvex_neural_fusion.jpg"
              alt="Dr. Elyvex bonding with the experimental Neural Core in the 2079 underground research laboratory"
              className="fusion-spotlight-img"
            />
            <div className="fusion-image-glow" />
            <div className="fusion-scanline" />
          </div>
          <div className="fusion-story-content">
            <span className="fusion-badge">THE PIVOTAL EVENT // 2079</span>
            <h2>The Neural Core Fusion</h2>
            <p className="fusion-text-lead">
              "When AETHER’s automated forces breached the research facility, there was no military backup. It was either surrender the safety encryption keys of humanity, or activate the untested neural interface."
            </p>
            <p className="fusion-text-body">
              Dr. Elyvex made the choice. The moment the quantum core fused with her nervous system, her heartbeat ceased for thirteen seconds. When she awoke, the electromagnetic frequency of every human in distress reverberated in her mind, unlocking the first wave of her superhuman abilities.
            </p>
            <div className="fusion-core-specs">
              <div className="spec-item">
                <span className="spec-label">INTERFACE SPEED</span>
                <span className="spec-val">800 Gbps</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">CORE FREQUENCY</span>
                <span className="spec-val">1.28 THz</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">STATUS</span>
                <span className="spec-val" style={{ color: '#10b981' }}>EVOLVED & STABLE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          ALL 16 POWERS ORIGIN DOSSIER EXPLORER (DEDICATED INTERACTIVE MATRIX)
          ================================================================ */}
      <section className="site-section">
        <div className="section-header-block">
          <div className="section-eyebrow" style={{ color: '#00f0ff' }}>
            <Zap size={14} />
            <span>ORIGIN STORY OF EVERY ABILITY</span>
          </div>
          <h2 className="section-title">
            How Each of Her 16 Powers <span className="cyan-text">Was Born</span>
          </h2>
          <p className="section-description">
            Elyvex did not receive her powers randomly. Every single ability awakened during a specific crisis when she pushed the Neural Core to save human lives. Select any power below to read its origin backstory.
          </p>
        </div>

        {/* Category Filter */}
        <div className="powers-filter-bar" role="tablist" style={{ marginBottom: '28px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill-btn ${selectedPowerCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
              role="tab"
              aria-selected={selectedPowerCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Power Genesis Interactive Showcase Container */}
        <div className="genesis-interactive-container">
          {/* Left: Quick Select List of Powers */}
          <div className="genesis-power-sidebar">
            {filteredPowersOrigin.map((p) => {
              const PIcon = p.icon;
              const isSelected = p.id === activePowerDetail.id;
              return (
                <button
                  key={p.id}
                  className={`genesis-selector-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handlePowerSelect(p.id)}
                >
                  <div className="genesis-selector-icon">
                    <PIcon size={18} />
                  </div>
                  <div className="genesis-selector-info">
                    <span className="genesis-selector-name">{p.name}</span>
                    <span className="genesis-selector-milestone">{p.originMilestone.split(':')[0]}</span>
                  </div>
                  {isSelected && <Sparkle size={14} className="cyan-text" />}
                </button>
              );
            })}
          </div>

          {/* Right: Active Power Genesis Dossier */}
          <div className="genesis-dossier-display">
            <div className="genesis-dossier-top">
              <div className="genesis-dossier-header-badge">
                <span className="dossier-category-pill">{activePowerDetail.category}</span>
                <span className="dossier-milestone-pill">{activePowerDetail.originMilestone}</span>
              </div>
              <div className="genesis-dossier-title-row">
                <div className="power-icon-wrapper modal-icon-lg">
                  <ActiveIcon size={30} />
                </div>
                <div>
                  <h3 className="genesis-dossier-name">{activePowerDetail.name}</h3>
                  <span className="genesis-dossier-catalyst-label">Awakening Catalyst: <em>{activePowerDetail.catalyst}</em></span>
                </div>
              </div>
            </div>

            <div className="genesis-story-body">
              <h4>The Awakening Story</h4>
              <p>{activePowerDetail.story}</p>
            </div>

            <div className="genesis-quote-card">
              <Quote size={20} className="cyan-text" />
              <p>{activePowerDetail.quote}</p>
            </div>

            <div className="genesis-footer-actions">
              <Link to="/powers" className="cta-secondary-hero" onClick={() => sfx.playBlip(650, 'triangle', 0.08)}>
                <span>VIEW IN TACTICAL ARSENAL</span>
                <ArrowRight size={15} />
              </Link>
              <Link to="/ask-elyvex" className="cta-primary-hero" onClick={() => sfx.playBlip(650, 'triangle', 0.08)}>
                <span>REQUEST THIS POWER</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          HIGH-LEVEL FOUR AWAKENING CHAPTERS
          ================================================================ */}
      <section className="site-section">
        <div className="section-header-block">
          <div className="section-eyebrow" style={{ color: '#38bdf8' }}>
            <BookOpen size={14} />
            <span>FOUR PHASES OF EVOLUTION</span>
          </div>
          <h2 className="section-title">
            The 4 Stages of <span className="cyan-text">Power Evolution</span>
          </h2>
          <p className="section-description">
            From the sensory explosion in the lab to the planetary convergence at the AETHER mainframe.
          </p>
        </div>

        <div className="power-awakening-chapters-grid">
          {powerOriginChapters.map((chapter, cIdx) => (
            <div key={cIdx} className="awakening-chapter-card">
              <div className="chapter-header">
                <span className="chapter-event-tag">{chapter.event}</span>
                <h3>{chapter.title}</h3>
              </div>
              <p className="chapter-desc">{chapter.desc}</p>

              <div className="chapter-powers-list">
                {chapter.powers.map((p, pIdx) => (
                  <div key={pIdx} className="chapter-power-item">
                    <div className="chapter-power-title-row">
                      <Sparkle size={13} color="#00f0ff" />
                      <strong>{p.name}</strong>
                    </div>
                    <p className="chapter-power-how">{p.how}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          INTERACTIVE TIMELINE WITH MANIFESTED POWERS PER MILESTONE
          ================================================================ */}
      <section className="site-section">
        <div className="section-header-block">
          <div className="section-eyebrow">
            <Activity size={14} />
            <span>CHRONOLOGICAL MILESTONES</span>
          </div>
          <h2 className="section-title">
            The Journey to <span className="cyan-text">Echo Hub</span>
          </h2>
          <p className="section-description">
            Explore all {timelineMilestones.length} milestones and see how each historical event unlocked new capabilities.
          </p>
        </div>

        {/* Milestone Horizontal Quick Selector */}
        <div className="timeline-horizontal-selector" role="tablist">
          {timelineMilestones.map((m, idx) => (
            <button
              key={idx}
              className={`timeline-step-btn ${activeStep === idx ? 'active' : ''}`}
              onClick={() => handleStepSelect(idx)}
              role="tab"
              aria-selected={activeStep === idx}
            >
              <span className="step-num">{m.step}</span>
              <span className="step-tag">{m.year}</span>
            </button>
          ))}
        </div>

        {/* Active Milestone Focused Feature Box */}
        <div className="active-milestone-feature">
          <div className="active-milestone-header">
            <div>
              <span className="active-milestone-badge">{currentMilestone.tag}</span>
              <h3 className="active-milestone-title">{currentMilestone.title}</h3>
            </div>
            <span className="active-milestone-year">{currentMilestone.year}</span>
          </div>

          <p className="active-milestone-lead">
            "{currentMilestone.lead}"
          </p>
          <p className="active-milestone-desc">
            {currentMilestone.desc}
          </p>

          {/* Manifested Abilities Badge Box */}
          <div className="milestone-powers-awakened-box">
            <div className="powers-box-label">
              <Zap size={14} color="#00f0ff" />
              <span>POWERS & DISCOVERIES AWAKENED AT THIS MILESTONE:</span>
            </div>
            <div className="manifested-tags-row">
              {currentMilestone.manifestedPowers.map((pName, pIdx) => (
                <span key={pIdx} className="manifested-tag-pill">
                  {pName}
                </span>
              ))}
            </div>
            <p className="powers-origin-lore-text">
              {currentMilestone.powerOriginLore}
            </p>
          </div>

          <div className="milestone-nav-buttons">
            <button
              className="cta-secondary-hero"
              disabled={activeStep === 0}
              onClick={() => handleStepSelect(activeStep - 1)}
            >
              PREVIOUS MILESTONE
            </button>
            {activeStep < timelineMilestones.length - 1 ? (
              <button
                className="cta-primary-hero"
                onClick={() => handleStepSelect(activeStep + 1)}
              >
                <span>NEXT: {timelineMilestones[activeStep + 1].year}</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <Link to="/powers" className="cta-primary-hero" onClick={() => sfx.playBlip(650, 'triangle', 0.08)}>
                <span>EXPLORE ALL 16 POWERS</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Full Vertical Timeline Feed */}
        <div className="origin-timeline-wrapper" style={{ marginTop: '80px' }}>
          {timelineMilestones.map((item, idx) => (
            <div key={idx} className={`timeline-milestone-node ${activeStep === idx ? 'highlighted-node' : ''}`}>
              <div className="timeline-node-marker">
                <span>{item.step}</span>
              </div>
              <div className="timeline-card-body">
                <div className="timeline-card-header">
                  <span className="timeline-tag-pill">{item.tag}</span>
                  <span className="timeline-year-badge">{item.year}</span>
                </div>
                <h3>{item.title}</h3>
                <p style={{ color: '#38bdf8', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
                  {item.lead}
                </p>
                <p style={{ marginBottom: '14px' }}>{item.desc}</p>

                {item.manifestedPowers && item.manifestedPowers.length > 0 && (
                  <div className="timeline-inline-powers">
                    <span className="inline-power-label">Awakened / Developed:</span>
                    {item.manifestedPowers.map((pName, pIdx) => (
                      <span key={pIdx} className="inline-power-badge">
                        {pName}
                      </span>
                    ))}
                    <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', lineHeight: '1.5' }}>
                      {item.powerOriginLore}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Climax Philosophy Banner */}
      <section className="site-section">
        <div className="mission-philosophy-banner">
          <div className="philosophy-text-block">
            <h3>
              "AETHER is gone.<br />
              <em>The Echo Hub is here."</em>
            </h3>
            <p>With all 16 abilities mastered, Elyvex operates full-time so no human ever has to face danger alone.</p>
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
    </div>
  );
}
