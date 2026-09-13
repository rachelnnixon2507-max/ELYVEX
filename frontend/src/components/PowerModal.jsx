import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, Shield, AlertTriangle, ArrowRight, BookOpen, Quote, Sparkle } from 'lucide-react';
import { sfx } from '../utils/SoundEffects';

export default function PowerModal({ power, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!power) return null;

  const IconComp = power.icon;

  const handleAskHelp = () => {
    sfx.playBlip(650, 'triangle', 0.08);
    onClose();
    navigate('/ask-elyvex');
  };

  const handleJumpToOrigin = () => {
    sfx.playBlip(600, 'sine', 0.06);
    onClose();
    navigate('/origin');
  };

  return (
    <div
      className="power-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-power-title"
    >
      <div
        className={`power-modal-box ${power.special ? 'modal-special-hazard' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="power-modal-close"
          onClick={onClose}
          aria-label="Close Diagnostic Panel"
        >
          <X size={22} />
        </button>

        <div className="modal-header-layout">
          <div className="power-icon-wrapper modal-icon-lg">
            <IconComp size={32} />
          </div>
          <div>
            <div className="modal-tier-tag">
              <Zap size={13} />
              <span>{power.tier}</span>
            </div>
            <h3 id="modal-power-title" className="modal-power-heading">
              {power.name}
            </h3>
          </div>
        </div>

        {power.special && (
          <div className="modal-hazard-banner">
            <AlertTriangle size={18} />
            <div>
              <strong>SYSTEM OVERCLOCK NOTICE:</strong>
              <span> {power.name === 'Dark Echo' ? 'Channels accumulated systemic corruption. High emotional/somatic toll on Elyvex.' : 'Planetary-scale harmonic convergence. Maximum resonance capability.'}</span>
            </div>
          </div>
        )}

        <div className="modal-summary-block">
          <p>{power.summary}</p>
        </div>

        {/* Origin & Awakening Story Section */}
        {power.originStory && (
          <div className="modal-origin-story-card">
            <div className="modal-origin-header">
              <div className="modal-origin-badge">
                <BookOpen size={13} color="#00f0ff" />
                <span>ORIGIN & AWAKENING STORY</span>
              </div>
              <span className="modal-origin-milestone-tag">{power.originMilestone}</span>
            </div>
            {power.catalyst && (
              <div className="modal-catalyst-row">
                <strong>Awakening Catalyst:</strong> <span>{power.catalyst}</span>
              </div>
            )}
            <p className="modal-origin-story-body">{power.originStory}</p>
            {power.quote && (
              <div className="modal-origin-quote">
                <Quote size={14} color="#00f0ff" />
                <em>{power.quote}</em>
              </div>
            )}
          </div>
        )}

        <div className="modal-dossier-card">
          <div className="dossier-header-label">NEURAL CORE TACTICAL DOSSIER</div>
          <p className="dossier-lore-body">{power.lore}</p>
        </div>

        <div className="modal-footer-stats">
          <div className="stat-pill-group">
            <span className="stat-pill-label">ENERGY PROFILE</span>
            <strong className="stat-pill-val">{power.energy}</strong>
          </div>
          <div className="stat-pill-group">
            <span className="stat-pill-label">OPERATIONAL STATE</span>
            <strong className="stat-pill-val" style={{ color: power.special ? '#f43f5e' : '#38bdf8' }}>
              {power.status || 'Active'}
            </strong>
          </div>
          <div className="modal-actions-row">
            <button className="cta-secondary-hero" onClick={handleJumpToOrigin} style={{ padding: '12px 18px', fontSize: '12px' }}>
              <span>READ ORIGIN TIMELINE</span>
            </button>
            <button className="cta-primary-hero modal-cta-btn" onClick={handleAskHelp}>
              <span>REQUEST ELYVEX'S ASSISTANCE</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
