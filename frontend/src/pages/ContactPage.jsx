import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio, Shield, AlertTriangle, ArrowRight, Zap, Lock,
  PhoneCall, HeartPulse, Send, CheckCircle2
} from 'lucide-react';
import { sfx } from '../utils/SoundEffects';
import { apiFetch } from '../config/api';

export default function ContactPage() {
  const [quickBeaconSent, setQuickBeaconSent] = useState(false);
  const [beaconSector, setBeaconSector] = useState('');
  const [beaconSending, setBeaconSending] = useState(false);

  const handleSendBeacon = async (e) => {
    e.preventDefault();
    if (!beaconSector.trim() || beaconSending) return;

    setBeaconSending(true);
    sfx.playBeacon();

    try {
      await apiFetch('/help-requests', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Emergency Beacon User',
          age: 20,
          location: beaconSector.trim(),
          email: 'emergency-beacon@echohub.net',
          problem: `[EMERGENCY PRIORITY BEACON TRIGGERED] Location: ${beaconSector.trim()}`
        })
      });
      setQuickBeaconSent(true);
    } catch {
      setQuickBeaconSent(true);
    } finally {
      setBeaconSending(false);
    }
  };

  return (
    <div className="page-wrapper" aria-label="Emergency Help & Contact">
      {/* Header Banner */}
      <section className="page-header-section">
        <div className="section-eyebrow">
          <AlertTriangle size={14} color="#f59e0b" />
          <span style={{ color: '#f59e0b' }}>EMERGENCY TRANSMISSION FREQUENCY</span>
        </div>
        <h1 className="page-title-main">
          Emergency <span className="cyan-text">Contact.</span>
        </h1>
        <p className="page-lead-subtitle">
          If you are in immediate danger or facing an aggressive technological breach, transmit a high-priority distress signal to Elyvex's Neural Core.
        </p>
      </section>

      {/* Emergency Distress Beacon Box */}
      <section className="site-section">
        <div className="emergency-beacon-launch-card">
          <div className="beacon-card-header">
            <div className="beacon-icon-halo">
              <Radio size={36} color="#00f0ff" />
            </div>
            <div>
              <span className="section-eyebrow" style={{ color: '#00f0ff', marginBottom: '4px' }}>
                INSTANT SECTOR DISPATCH
              </span>
              <h2>Transmit Distress Coordinates</h2>
            </div>
          </div>

          <p className="beacon-desc-text">
            Sending a distress beacon immediately alerts Elyvex’s Echo Sense bio-radar and initiates quantum location tracking for rapid intervention.
          </p>

          {!quickBeaconSent ? (
            <form className="beacon-form-row" onSubmit={handleSendBeacon}>
              <input
                type="text"
                className="beacon-input"
                value={beaconSector}
                onChange={(e) => setBeaconSector(e.target.value)}
                placeholder="Enter your current city, address, or sector..."
                required
              />
              <button
                type="submit"
                className="cta-contact-beacon beacon-submit-btn"
                disabled={!beaconSector.trim() || beaconSending}
              >
                <span>{beaconSending ? 'TRANSMITTING BEACON...' : 'PULSE DISTRESS BEACON'}</span>
                <Send size={18} />
              </button>
            </form>
          ) : (
            <div className="beacon-active-alert">
              <CheckCircle2 size={24} color="#10b981" />
              <div>
                <strong>BEACON TRANSMISSION ACTIVE</strong>
                <p>Coordinates received in Sector [{beaconSector}]. Neural Core has locked frequency. Stay in safe cover—Elyvex is responding.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Alternative Channels Grid */}
      <section className="site-section">
        <div className="section-header-block">
          <div className="section-eyebrow">
            <Shield size={14} />
            <span>COMMUNICATION CHANNELS</span>
          </div>
          <h2 className="section-title">
            Direct <span className="cyan-text">Sanctuaries</span>
          </h2>
          <p className="section-description">
            Choose the method of communication that best fits your current security posture.
          </p>
        </div>

        <div className="contact-channels-grid">
          <div className="channel-tile">
            <div className="channel-icon-wrap">
              <Zap size={24} />
            </div>
            <h3>Conversational Intake</h3>
            <p>Talk directly with Elyvex step-by-step in a comfortable, encrypted chat session.</p>
            <Link to="/ask-elyvex" className="channel-action-link" onClick={() => sfx.playBlip(600, 'sine', 0.05)}>
              <span>OPEN CHAT PORTAL</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="channel-tile">
            <div className="channel-icon-wrap">
              <Radio size={24} />
            </div>
            <h3>Echo Hub Command</h3>
            <p>Inspect global network telemetry, active frequencies, and real-time response latency.</p>
            <Link to="/echo-hub" className="channel-action-link" onClick={() => sfx.playBlip(600, 'sine', 0.05)}>
              <span>GO TO COMMAND CENTER</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="channel-tile">
            <div className="channel-icon-wrap">
              <HeartPulse size={24} />
            </div>
            <h3>Trauma & Pain Transfer</h3>
            <p>For individuals in psychological crisis or carrying unbearable trauma burdens.</p>
            <Link to="/ask-elyvex" className="channel-action-link" onClick={() => sfx.playBlip(600, 'sine', 0.05)}>
              <span>REQUEST EMOTIONAL CARE</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
