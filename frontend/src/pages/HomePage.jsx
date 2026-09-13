import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Eye, Cpu, BrainCircuit, HeartPulse, Sparkles, Radio,
  Zap, Flame, Send, ArrowRight, Bot, ChevronDown, CheckCircle2,
  Lock, Activity, Compass, Layers, Terminal, Sparkle, Play, X,
  RadioTower, Volume2, Users, RotateCcw
} from 'lucide-react';
import { powersData } from '../data/powersData';
import { timelineMilestones, missionPillars } from '../data/storyData';
import PowerModal from '../components/PowerModal';
import { sfx } from '../utils/SoundEffects';
import { INITIAL_GREETING, getElyvexCompanionReply } from '../utils/elyvexCompanionAi';

function parseInlineFormatting(str) {
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="cyan-highlight">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderFormattedMessage(text, isStreaming) {
  if (!text && !isStreaming) return null;
  const paragraphs = (text || '').split('\n\n');
  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        const isBulletList = lines.length > 1 && lines.every(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().match(/^[🛡️🌐🧠⚡🛠️📖]/));
        
        if (isBulletList) {
          return (
            <ul key={pIdx} className="companion-bullet-list">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[•\-]\s*/, '');
                return (
                  <li key={lIdx}>
                    {parseInlineFormatting(cleanLine)}
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={pIdx} className="companion-text-para">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {parseInlineFormatting(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
      {isStreaming && <span className="streaming-cursor">▊</span>}
    </>
  );
}

export default function HomePage() {
  const [selectedPower, setSelectedPower] = useState(null);
  const [activeTriage, setActiveTriage] = useState('tech-threat');
  const [watchSignalOpen, setWatchSignalOpen] = useState(false);
  // Interactive AI Companion Chat State
  const [companionMessages, setCompanionMessages] = useState([INITIAL_GREETING]);
  const [companionInput, setCompanionInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatStreamRef = useRef(null);

  const handlePowerClick = (power) => {
    sfx.playBlip(700, 'sine', 0.08);
    setSelectedPower(power);
  };

  const handleOpenSignal = () => {
    sfx.playBeacon();
    setWatchSignalOpen(true);
  };

  const handleCompanionSend = async (overrideText) => {
    const query = typeof overrideText === 'string' ? overrideText.trim() : companionInput.trim();
    if (!query || isThinking) return;

    sfx.playBlip(700, 'sine', 0.06);
    setCompanionInput('');

    const userMsg = { id: `user-${Date.now()}`, from: 'user', text: query };
    const updatedHistory = [...companionMessages, userMsg];
    setCompanionMessages(updatedHistory);
    setIsThinking(true);

    try {
      const reply = await getElyvexCompanionReply(query, updatedHistory);
      sfx.playBlip(900, 'triangle', 0.06);

      const fullText = reply.text || '';
      const botMsgId = `bot-${Date.now()}`;

      setCompanionMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          from: 'bot',
          text: fullText,
          isStreaming: false,
          chips: reply.chips,
          link: reply.link,
          source: 'Elyvex Neural Core'
        }
      ]);
      setIsThinking(false);
    } catch (err) {
      setIsThinking(false);
      setCompanionMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          from: 'bot',
          text: "Neural connection re-routing. All systems are listening. What would you like to build or explore?",
          chips: ["How can I get started?", "Give me project ideas", "What are your superpowers?"]
        }
      ]);
    }
  };

  const handleResetChat = () => {
    sfx.playBlip(500, 'sine', 0.05);
    setCompanionMessages([INITIAL_GREETING]);
    setCompanionInput('');
    setIsThinking(false);
  };

  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [companionMessages, isThinking]);

  return (
    <main className="homepage-cinematic-flow">
      {/* ==================================================================
          HOMEPAGE HERO SECTION — 1.png (Full-Bleed, No Boxed Image)
          ================================================================== */}
      <div className="section-backdrop-wrapper bg-hero-nightcity">
        <section id="home" className="hero-section myth-hero-theme" aria-label="Hero Section">
          {/* Left Column: Typography, Sub-Tracker, CTAs & Telemetry */}
          <div className="hero-left-content myth-hero-left">
            {/* Top Cursive Tagline */}
            <div className="hero-cursive-tagline" aria-hidden="true">
              Better Version of Tomorrow
            </div>

            {/* Top Frequency & Category Tracker */}
            <div className="resonance-tracker-header">
              <div className="tracker-frequency-row">
                <span className="live-pulse-dot" />
                <span className="tracker-freq-label">FREQUENCY: ACTIVE // LISTENING</span>
              </div>
              <div className="tracker-breadcrumbs-strip">
                <span>INNOVATE</span>
                <span className="tracker-slash">/</span>
                <span>DEFEND</span>
                <span className="tracker-slash">/</span>
                <span>EMPOWER</span>
                <span className="tracker-slash">/</span>
                <span className="tracker-cyan-glow">A BETTER TOMORROW</span>
              </div>
            </div>

            {/* Giant Impact Title: ELYVEX */}
            <div className="myth-giant-title-container">
              <h1 className="myth-headline-stacked">
                <span className="myth-title-word word-the">ELY</span>
                <span className="myth-title-word word-myth">
                  V<span className="myth-letter-accent">E</span>X
                </span>
              </h1>
            </div>

            {/* Sub-headline */}
            <h2 className="myth-subheading-tagline">
              WHERE HUMAN EMPATHY MEETS QUANTUM INTELLIGENCE.
            </h2>

            {/* Narrative Lead */}
            <p className="myth-narrative-lead">
              A safe place to be heard. Share what weighs on you, and let your voice reach someone who cares.
            </p>

            {/* Action Buttons: Blue Glowing Summon & Watch Signal */}
            <div className="myth-hero-actions-row">
              <Link
                to="/ask-elyvex"
                className="myth-cta-primary-summon"
                onClick={() => sfx.playBlip(650, 'sine', 0.08)}
              >
                <Zap size={16} fill="currentColor" />
                <span>ASK ELYVEX FOR HELP</span>
                <ArrowRight size={16} />
              </Link>

              <button
                className="myth-cta-secondary-watch"
                onClick={handleOpenSignal}
              >
                <Play size={15} fill="currentColor" />
                <span>WATCH SIGNAL</span>
              </button>
            </div>

            {/* 3-Column Bottom Telemetry Metrics Strip */}
            <div className="myth-three-pillars-strip" aria-label="Resonance Pillars">
              <div className="myth-pillar-col">
                <span className="pillar-top-label">REAL PEOPLE</span>
                <span className="pillar-bottom-sub">YOU SPEAK</span>
              </div>
              <div className="myth-pillar-col">
                <span className="pillar-top-label">REAL STORIES</span>
                <span className="pillar-bottom-sub">SHE LISTENS</span>
              </div>
              <div className="myth-pillar-col">
                <span className="pillar-top-label">REAL CHANGE</span>
                <span className="pillar-bottom-sub">A BRIGHTER TOMORROW</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Vertical Hologram & Scroll Indicator (No Boxed Image) */}
          <div className="hero-right-hologram" aria-hidden="true">
            <div className="vertical-hologram-sign">
              <span className="sign-glyph">▲</span>
              <span className="sign-word">DREAM</span>
              <span className="sign-word">CODE</span>
              <span className="sign-word">BUILD</span>
              <span className="sign-word glow-cyan">REPEAT</span>
            </div>

            <div className="hero-scroll-indicator">
              <span className="scroll-label">SCROLL</span>
              <div className="scroll-mouse-pill">
                <span className="scroll-wheel-dot" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==================================================================
          WATCH SIGNAL LIVE FREQUENCY MODAL
          ================================================================== */}
      {watchSignalOpen && (
        <div className="power-modal-overlay" onClick={() => setWatchSignalOpen(false)}>
          <div className="power-modal-box myth-signal-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="power-modal-close"
              onClick={() => setWatchSignalOpen(false)}
              aria-label="Close Signal Monitor"
            >
              <X size={22} />
            </button>

            <div className="modal-header-layout">
              <div className="power-icon-wrapper modal-icon-lg" style={{ background: 'rgba(0, 240, 255, 0.15)', borderColor: '#00f0ff', color: '#00f0ff' }}>
                <RadioTower size={30} />
              </div>
              <div>
                <div className="modal-tier-tag" style={{ color: '#00f0ff' }}>
                  <Zap size={13} />
                  <span>LIVE RESONANCE TELEMETRY</span>
                </div>
                <h3 className="modal-power-heading">
                  Active Echo Frequency // 842.1 MHz
                </h3>
              </div>
            </div>

            <div className="myth-signal-visualizer-box">
              <div className="signal-radar-circle">
                <div className="radar-sweep" />
                <div className="radar-blip blip-1" />
                <div className="radar-blip blip-2" />
                <span className="radar-center-core">ELYVEX</span>
              </div>
              <div className="signal-telemetry-readout">
                <p><strong>RESONANCE GRID:</strong> ONLINE (3,842 listening nodes)</p>
                <p><strong>ENCRYPTION:</strong> QUANTUM-4 SECURE</p>
                <p><strong>CURRENT STATUS:</strong> Monitoring sector distress channels across metropolitan grid.</p>
                <p style={{ color: '#00f0ff', marginTop: '10px' }}><em>"You are never shouting into the void. Someone is already listening."</em></p>
              </div>
            </div>

            <div className="modal-footer-stats">
              <button
                className="myth-cta-primary-summon"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setWatchSignalOpen(false);
                  navigate('/ask-elyvex');
                }}
              >
                <span>TRANSMIT YOUR DISTRESS SIGNAL NOW</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          SECTION 1: WHO IS ELYVEX? (2.jpg - Heroine on Left, Content on Right)
          ================================================================== */}
      <div className="section-backdrop-wrapper bg-who-elyvex">
        <section id="who-is-elyvex" className="site-section layout-character-left">
          <div className="section-right-aligned-content">
            <div className="section-header-block text-left">
              <div className="section-eyebrow">
                <Activity size={14} />
                <span>01 // GUARDIAN IDENTITY</span>
              </div>
              <h2 className="section-title">
                MORE THAN <span className="cyan-text">TECHNOLOGY</span>
              </h2>
              <div className="guardian-narrative-card">
                <p className="section-description narrative-lead-glow">
                  Fused with an experimental quantum <span className="cyan-text">Neural Core</span>, Dr. Elyvex stands as humanity’s living shield — transforming trauma into strength and defending human dignity against rogue algorithms, automated surveillance, and digital overreach.
                </p>
              </div>
            </div>

            {/* 3 Modern Feature Cards */}
            <div className="identity-three-features-row">
              <div className="feature-mini-card">
                <div className="feature-mini-icon">
                  <BrainCircuit size={24} />
                </div>
                <div className="feature-mini-body">
                  <h4>Innovate</h4>
                  <p>Turn bold ideas into decentralized defenses and protective tools.</p>
                </div>
              </div>

              <div className="feature-mini-card">
                <div className="feature-mini-icon">
                  <HeartPulse size={24} />
                </div>
                <div className="feature-mini-body">
                  <h4>Empower</h4>
                  <p>People over possibilities — sensing and supporting human struggles.</p>
                </div>
              </div>

              <div className="feature-mini-card">
                <div className="feature-mini-icon">
                  <Shield size={24} />
                </div>
                <div className="feature-mini-body">
                  <h4>Impact</h4>
                  <p>Creating lasting safety as a 24/7 living shield for everyone.</p>
                </div>
              </div>
            </div>

            {/* Cursive Annotation */}
            <div className="cursive-floating-annotation right-annotation" aria-hidden="true">
              Small Steps<br />
              <span>Bigger Tomorrows</span> ⤹
            </div>
          </div>
        </section>
      </div>

      {/* ==================================================================
          SECTION 2: POWERS SHOWCASE & LIVE INTERACTIVE COMPANION (3.png)
          ================================================================== */}
      <div className="section-backdrop-wrapper bg-powers-arsenal">
        <section id="powers-preview" className="site-section">
          <div className="section-header-block">
            <div className="section-eyebrow">
              <Zap size={14} />
              <span>02 // YOUR AI COMPANION & ARSENAL</span>
            </div>
            <h2 className="section-title">
              ASK. EXPLORE. <span className="cyan-text">CREATE.</span>
            </h2>
            <p className="section-description">
              Have a question, an idea or just curiosity? Chat with Elyvex — your companion for ideas, learning and building a better tomorrow.
            </p>
          </div>

          {/* Interactive Chat Console Box */}
          <div className="companion-interactive-widget">
            <div className="companion-chat-card">
              {/* Card Header Bar */}
              <div className="companion-header-bar">
                <div className="companion-header-left">
                  <div className="companion-logo-badge">▲</div>
                  <div>
                    <div className="companion-title-row">
                      <span className="companion-title-name">ELYVEX</span>
                      <span className="companion-title-role">// NEURAL COMPANION</span>
                    </div>
                    <div className="companion-status-indicator">
                      <span className="live-pulse-dot" />
                      <span>LIVE NEURAL LINK: QUANTUM MATRIX // ONLINE</span>
                    </div>
                  </div>
                </div>

                <div className="companion-header-actions">
                  <div
                    className="companion-model-pill-badge"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '12px',
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.25)',
                      color: '#00f0ff',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <Zap size={12} color="#00f0ff" />
                    <span>Quantum Core v2.4</span>
                  </div>

                  {companionMessages.length > 1 && (
                    <button
                      type="button"
                      className="companion-reset-btn"
                      onClick={handleResetChat}
                      title="Reset Conversation"
                      aria-label="Reset Conversation"
                    >
                      <RotateCcw size={13} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Stream Viewport */}
              <div className="companion-chat-stream" ref={chatStreamRef} role="log" aria-live="polite">
                {companionMessages.map((msg, idx) => {
                  const isLastBot = msg.from === 'bot' && idx === companionMessages.length - 1;
                  return (
                    <div key={msg.id || idx} className={`companion-msg-row ${msg.from}`}>
                      {msg.from === 'bot' && (
                        <div className="companion-msg-avatar">
                          <Bot size={15} />
                        </div>
                      )}
                      <div className={`companion-bubble ${msg.from}`}>
                        <div className="companion-bubble-content">
                          {renderFormattedMessage(msg.text, msg.isStreaming)}
                        </div>

                        {msg.link && !msg.isStreaming && (
                          <div className="companion-bubble-link-wrap">
                            <Link
                              to={msg.link.to}
                              className="companion-link-btn"
                              onClick={() => sfx.playBlip(650, 'triangle', 0.08)}
                            >
                              <span>{msg.link.label}</span>
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        )}

                        {/* Interactive Suggestion Chips directly under the latest bot message */}
                        {isLastBot && !isThinking && !msg.isStreaming && msg.chips && msg.chips.length > 0 && (
                          <div className="companion-msg-chips-row">
                            {msg.chips.map((chip, cIdx) => (
                              <button
                                key={cIdx}
                                type="button"
                                className="quick-chip-btn"
                                onClick={() => handleCompanionSend(chip)}
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Thinking / Neural Processing State */}
                {isThinking && (
                  <div className="companion-msg-row bot thinking">
                    <div className="companion-msg-avatar">
                      <Bot size={15} />
                    </div>
                    <div className="companion-bubble bot thinking-bubble">
                      <div className="elyvex-typing-indicator">
                        <span className="typing-dot dot-1" />
                        <span className="typing-dot dot-2" />
                        <span className="typing-dot dot-3" />
                      </div>
                      <span className="typing-label">Dr. Elyvex is streaming thoughts across neural network...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form className="companion-input-form" onSubmit={(e) => { e.preventDefault(); handleCompanionSend(); }}>
                <input
                  type="text"
                  placeholder="Ask Elyvex anything in natural language..."
                  value={companionInput}
                  onChange={(e) => setCompanionInput(e.target.value)}
                  disabled={isThinking}
                />
                <button
                  type="submit"
                  disabled={!companionInput.trim() || isThinking}
                  aria-label="Submit Question"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Right Side Floating Tags & Cursive Script */}
            <div className="companion-floating-tags-col" aria-hidden="true">
              <span className="floating-bubble-tag">Ideas?</span>
              <span className="floating-bubble-tag">Opportunities?</span>
              <span className="floating-bubble-tag">A better tomorrow?</span>
              <div className="cursive-floating-annotation build-annotation">
                Let's<br />
                <span>Build Together</span> ✦
              </div>
            </div>
          </div>

          {/* Tactical Superpowers Grid Below Companion */}
          <div className="powers-grid-container" style={{ marginTop: '50px' }}>
            {powersData.slice(0, 4).map((power, idx) => {
              const IconComp = power.icon;
              return (
                <div
                  key={power.id}
                  className={`power-hologram-card ${power.special ? 'special-dark' : ''}`}
                  onClick={() => handlePowerClick(power)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handlePowerClick(power);
                  }}
                  aria-label={`Inspect power: ${power.name}`}
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

          <div className="section-center-action">
            <Link
              to="/powers"
              className="cta-secondary-hero"
              onClick={() => sfx.playBlip(650, 'triangle', 0.08)}
            >
              <span>VIEW ALL 16 SUPERPOWERS & COSTUME SPECS</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* ==================================================================
          SECTION 3: A BRIGHTER WORLD & ORIGIN (4.jpg - Earth on Right)
          ================================================================== */}
      <div className="section-backdrop-wrapper bg-origin-chronicles">
        <section id="origin-preview" className="site-section layout-earth-right">
          <div className="section-left-aligned-content">
            <div className="section-header-block text-left">
              <div className="section-eyebrow">
                <Layers size={14} />
                <span>03 // A BRIGHTER WORLD</span>
              </div>
              <h2 className="section-title">
                People + Ideas + Technology<br />
                <span className="cyan-text">= Real Change.</span>
              </h2>
            </div>

            {/* Origin Chronicles Preview */}
            <div className="origin-timeline-wrapper" style={{ marginTop: '30px' }}>
              {timelineMilestones.slice(0, 2).map((item, idx) => (
                <div key={idx} className="timeline-milestone-node">
                  <div className="timeline-node-marker">
                    <span>{item.step}</span>
                  </div>
                  <div className="timeline-card-body">
                    <div className="timeline-card-header">
                      <span className="timeline-tag-pill">{item.tag}</span>
                      <span className="timeline-year-badge">{item.year}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-left-action" style={{ marginTop: '24px' }}>
              <Link
                to="/origin"
                className="cta-primary-hero"
                onClick={() => sfx.playBlip(650, 'triangle', 0.08)}
              >
                <span>EXPLORE FULL ORIGIN CHRONICLES (2079–PRESENT)</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Orbit Cursive Annotation */}
          <div className="cursive-floating-annotation earth-orbit-script" aria-hidden="true">
            Same<br />
            Curiosity<br />
            <span>Bigger</span><br />
            <span>Tomorrows</span>
          </div>
        </section>
      </div>

      {/* ==================================================================
          SECTION 4 & 5: JOIN US & LIVE ECHO HUB (5.jpg)
          ================================================================== */}
      <div className="section-backdrop-wrapper bg-mission-directives">
        <section id="mission-preview" className="site-section layout-join-us">
          <div className="section-left-aligned-content">
            <div className="section-header-block text-left">
              <div className="section-eyebrow">
                <Shield size={14} />
                <span>04 // JOIN US</span>
              </div>
              <h2 className="section-title">
                Be Part of <span className="cyan-text">What's Next</span>
              </h2>
              <p className="section-description">
                Collaborate, create, and contribute to a future where technology serves people — and the planet.
              </p>
            </div>

            {/* CTA Buttons Row */}
            <div className="join-us-buttons-row">
              <Link
                to="/ask-elyvex"
                className="myth-cta-primary-summon"
                onClick={() => sfx.playBlip(650, 'sine', 0.08)}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/contact"
                className="myth-cta-secondary-watch"
                onClick={() => sfx.playBlip(650, 'triangle', 0.08)}
              >
                <Users size={16} />
                <span>Join Community</span>
              </Link>
            </div>

            {/* Mission 4 Pillars Grid */}
            <div className="mission-four-pillars-grid" style={{ marginTop: '40px' }}>
              {missionPillars.map((mission, idx) => {
                const IconComp = mission.icon;
                return (
                  <div key={idx} className="pillar-card">
                    <div className="pillar-card-icon-halo">
                      <IconComp size={24} />
                    </div>
                    <span className="pillar-subtitle">{mission.subtitle}</span>
                    <h3>{mission.title}</h3>
                    <p>{mission.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Reusable Power Diagnostic Modal */}
      <PowerModal power={selectedPower} onClose={() => setSelectedPower(null)} />
    </main>
  );
}
