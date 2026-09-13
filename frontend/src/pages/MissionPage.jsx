import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Shield, HeartPulse, Radio, Sparkles, CheckCircle2,
  ArrowRight, Lock, Eye, AlertCircle, HelpCircle
} from 'lucide-react';
import { missionPillars, guidanceCategories } from '../data/storyData';
import { sfx } from '../utils/SoundEffects';

export default function MissionPage() {
  return (
    <div className="page-wrapper" aria-label="Elyvex Mission & Philosophy">
      {/* Header Banner */}
      <section className="page-header-section">
        <div className="section-eyebrow">
          <Compass size={14} />
          <span>GUARDIAN PRINCIPLES // HUMAN-FIRST</span>
        </div>
        <h1 className="page-title-main">
          Her <span className="cyan-text">Mission.</span>
        </h1>
        <p className="page-lead-subtitle">
          Elyvex does not only fight world-ending rogue AIs. Her core duty is helping everyday people navigate fear, trauma, and technological oppression.
        </p>
      </section>

      {/* Main Philosophy Manifesto */}
      <section className="site-section">
        <div className="mission-manifesto-box">
          <div className="manifesto-quote-mark">“</div>
          <h2 className="manifesto-headline">
            "Technology should never make people powerless."
          </h2>
          <p className="manifesto-body">
            We live in a world where autonomous algorithms decide who gets medical care, smart locks dictate shelter, and automated surveillance catalogues human vulnerability. When systems fail or turn hostile, ordinary individuals are left without recourse. Elyvex exists to be the voice, shield, and sanctuary that technology forgot to build.
          </p>
          <div className="manifesto-author-strip">
            <span>DR. ELYVEX // FOUNDER & GUARDIAN OF ECHO HUB</span>
            <span>SECURE PROTOCOL 2079</span>
          </div>
        </div>
      </section>

      {/* The 4 Core Pillars */}
      <section className="site-section">
        <div className="section-header-block">
          <div className="section-eyebrow">
            <Shield size={14} />
            <span>FOUR PILLARS OF ACTION</span>
          </div>
          <h2 className="section-title">
            How Elyvex <span className="cyan-text">Protects</span>
          </h2>
          <p className="section-description">
            Four guiding directives that govern every response, intervention, and defense protocol.
          </p>
        </div>

        <div className="mission-four-pillars-grid">
          {missionPillars.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div key={idx} className="mission-detail-pillar-card">
                <div className="detail-pillar-header">
                  <div className="mission-pillar-icon">
                    <IconComp size={28} />
                  </div>
                  <span className="pillar-badge-tag">{pillar.badge || `DIRECTIVE 0${idx + 1}`}</span>
                </div>

                <h3 className="detail-pillar-title">{pillar.title}</h3>
                <p className="detail-pillar-lead">{pillar.lead || pillar.desc}</p>

                {pillar.points && pillar.points.length > 0 && (
                  <ul className="pillar-points-list">
                    {pillar.points.map((pt, pIdx) => (
                      <li key={pIdx}>
                        <CheckCircle2 size={16} color="#00f0ff" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* What Elyvex Can Help You With */}
      <section className="site-section">
        <div className="section-header-block">
          <div className="section-eyebrow">
            <HelpCircle size={14} />
            <span>ASSISTANCE DOMAINS</span>
          </div>
          <h2 className="section-title">
            What You Can Ask For <span className="cyan-text">Help With</span>
          </h2>
          <p className="section-description">
            You don't need a formal report or technical jargon. If you are experiencing any of these situations, reach out directly.
          </p>
        </div>

        <div className="guidance-cards-grid">
          {guidanceCategories.map((cat, idx) => (
            <div key={idx} className="guidance-item-card">
              <div className="guidance-num">0{idx + 1}</div>
              <h3 className="guidance-title">{cat.title}</h3>
              <p className="guidance-desc">{cat.description || cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reassurance Banner */}
      <section className="site-section">
        <div className="mission-philosophy-banner">
          <div className="philosophy-text-block">
            <h3>
              "You don't need the perfect words.<br />
              <em>Just tell me what happened."</em>
            </h3>
            <p>Every distress transmission is received directly in Elyvex's Neural Core buffer.</p>
          </div>
          <Link
            to="/ask-elyvex"
            className="cta-primary-hero"
            onClick={() => sfx.playBlip(650, 'triangle', 0.08)}
          >
            <span>TALK TO ELYVEX NOW</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
