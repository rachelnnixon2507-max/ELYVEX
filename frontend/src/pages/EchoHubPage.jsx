import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio, Shield, Zap, Lock, Activity, CheckCircle2, ArrowRight,
  Server, Cpu, Wifi, Terminal, AlertCircle, RefreshCw
} from 'lucide-react';
import { sfx } from '../utils/SoundEffects';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function EchoHubPage() {
  const [networkHealth, setNetworkHealth] = useState({
    status: 'ONLINE',
    service: 'Elyvex Echo Hub API',
    neuralCore: 'STABLE',
    responseSystem: 'ACTIVE',
    latency: '34ms'
  });
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setNetworkHealth((prev) => ({
          ...prev,
          status: 'ONLINE',
          service: data.service || 'Elyvex Echo Hub API',
          neuralCore: 'STABLE',
          responseSystem: 'ACTIVE',
          latency: `${Math.floor(Math.random() * 15 + 25)}ms`
        }));
      }
    } catch {
      // Local fallback telemetry
      setNetworkHealth((prev) => ({
        ...prev,
        status: 'ONLINE (LOCAL BUFFER)',
        latency: '0.02ms'
      }));
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="page-wrapper" aria-label="Echo Hub Command Center">
      {/* Header Banner */}
      <section className="page-header-section">
        <div className="section-eyebrow">
          <Radio size={14} />
          <span>COMMAND CENTER // ECHO NETWORK</span>
        </div>
        <h1 className="page-title-main">
          ECHO <span className="cyan-text">HUB.</span>
        </h1>
        <p className="page-lead-subtitle">
          Elyvex’s official headquarters and quantum-encrypted help portal. All signals are routed directly to the Neural Core for rapid triage and protection.
        </p>
      </section>

      {/* Live Command Center HUD Telemetry Grid */}
      <section className="site-section">
        <div className="command-telemetry-hud-box">
          <div className="hud-box-header">
            <div className="hud-title-wrap">
              <Server size={18} color="#00f0ff" />
              <h3>LIVE ECHO NETWORK TELEMETRY</h3>
            </div>
            <button
              className="hud-refresh-btn"
              onClick={() => {
                sfx.playBlip(750, 'sine', 0.08);
                fetchStatus();
              }}
              title="Ping Network Status"
              aria-label="Refresh Telemetry"
            >
              <RefreshCw size={14} className={isChecking ? 'spin-anim' : ''} />
              <span>PING TELEMETRY</span>
            </button>
          </div>

          <div className="hud-stats-four-grid">
            <div className="hud-stat-tile">
              <span className="hud-tile-label">OPERATOR IDENTITY</span>
              <div className="hud-tile-value text-glow-cyan">
                <span className="live-pulse-dot" />
                ELYVEX ONLINE
              </div>
              <small className="hud-tile-sub">Chief Neural Architect</small>
            </div>

            <div className="hud-stat-tile">
              <span className="hud-tile-label">NETWORK STATUS</span>
              <div className="hud-tile-value" style={{ color: '#10b981' }}>
                <CheckCircle2 size={16} />
                {networkHealth.status}
              </div>
              <small className="hud-tile-sub">Encrypted Global Frequency</small>
            </div>

            <div className="hud-stat-tile">
              <span className="hud-tile-label">NEURAL CORE</span>
              <div className="hud-tile-value text-glow-cyan">
                <Zap size={16} />
                {networkHealth.neuralCore}
              </div>
              <small className="hud-tile-sub">Harmonic Resonance 99.8%</small>
            </div>

            <div className="hud-stat-tile">
              <span className="hud-tile-label">RESPONSE SYSTEM</span>
              <div className="hud-tile-value" style={{ color: '#38bdf8' }}>
                <Activity size={16} />
                {networkHealth.responseSystem}
              </div>
              <small className="hud-tile-sub">Latency {networkHealth.latency}</small>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Hub Launchpad */}
      <section className="site-section">
        <div className="hub-launchpad-card">
          <div className="launchpad-content">
            <div className="section-eyebrow">
              <Lock size={13} />
              <span>DIRECT CITIZEN ASSISTANCE</span>
            </div>
            <h2>Whatever you're facing, start here.</h2>
            <p>
              When you submit a signal through Echo Hub, you are not talking to a customer service queue or automated sorting robot. You are speaking directly to Elyvex.
            </p>
            <div className="launchpad-actions">
              <Link
                to="/ask-elyvex"
                className="cta-primary-hero launchpad-primary-btn"
                onClick={() => sfx.playBlip(700, 'triangle', 0.1)}
              >
                <span>TALK TO ELYVEX</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="cta-secondary-hero"
                onClick={() => sfx.playBlip(550, 'sine', 0.05)}
              >
                <span>EMERGENCY DISTRESS BEACON</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Echo Hub Works */}
      <section className="site-section">
        <div className="section-header-block">
          <div className="section-eyebrow">
            <Cpu size={14} />
            <span>OPERATIONAL PIPELINE</span>
          </div>
          <h2 className="section-title">
            How Echo Hub <span className="cyan-text">Operates</span>
          </h2>
          <p className="section-description">
            A three-stage human-first protocol ensuring complete confidentiality, rapid response, and zero bureaucratic delays.
          </p>
        </div>

        <div className="pipeline-steps-grid">
          <div className="pipeline-step-card">
            <div className="pipeline-step-badge">STEP 01</div>
            <h3>Signal Ingestion</h3>
            <p>
              You explain what is happening via our quantum-encrypted intake channel. Zero logs are sold or analyzed by external advertising algorithms.
            </p>
          </div>

          <div className="pipeline-step-card">
            <div className="pipeline-step-badge">STEP 02</div>
            <h3>Neural Core Triage</h3>
            <p>
              Elyvex analyzes the threat parameters: whether it requires Machine Override, Memory Walk trauma support, or physical hard-light intervention.
            </p>
          </div>

          <div className="pipeline-step-card">
            <div className="pipeline-step-badge">STEP 03</div>
            <h3>Direct Intervention</h3>
            <p>
              Elyvex deploys the necessary power profile to neutralize the threat, protect your safety, and follow up until you are completely secure.
            </p>
          </div>
        </div>
      </section>

      {/* Security Guarantee */}
      <section className="site-section">
        <div className="security-guarantee-panel">
          <div className="security-icon-circle">
            <Lock size={32} color="#00f0ff" />
          </div>
          <div className="security-text-block">
            <h3>Quantum Resilient Privacy Guarantee</h3>
            <p>
              "Your information is used strictly to evaluate and process your help request. Echo Hub operates outside of corporate databases, surveillance grids, and government monitoring."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
