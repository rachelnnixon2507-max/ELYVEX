import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send, Bot, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw,
  Lock, Shield, Zap, Sparkles, ChevronRight, User, RotateCcw,
  Mail, Calendar, MapPin, UserCheck, FileText, AlertCircle
} from 'lucide-react';
import { sfx } from '../utils/SoundEffects';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function AskElyvexPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: "Hey. I'm Elyvex. You don't have to face everything alone."
    },
    {
      id: 2,
      from: 'bot',
      text: "First, what should I call you?"
    }
  ]);

  const [step, setStep] = useState('name'); // 'name' | 'age' | 'location' | 'email' | 'problem' | 'submitting' | 'done' | 'error'
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    email: '',
    problem: ''
  });

  const [validationError, setValidationError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [loadingText, setLoadingText] = useState('Establishing secure channel...');
  const [confirmationData, setConfirmationData] = useState(null);
  const chatStreamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [messages, validationError]);

  const submitPayload = async (payload) => {
    setStep('submitting');
    setLoadingText('Connecting to Echo Network...');

    const t1 = setTimeout(() => setLoadingText('Validating transmission & quantum encryption...'), 500);
    const t2 = setTimeout(() => setLoadingText('Dispatching automatic email notification to Dr. Elyvex...'), 1100);

    try {
      const res = await fetch(`${API_BASE}/help-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      clearTimeout(t1);
      clearTimeout(t2);

      let data = {};
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = {};
        }
      }

      if (!res.ok || data.ok === false) {
        const errorMsg = data.error || (res.status === 404
          ? 'Echo Hub API is unreachable (404 Not Found). The backend server is not connected. If hosted on Vercel, set VITE_API_URL or deploy the backend API.'
          : `Server responded with status code (${res.status}).`);
        throw new Error(errorMsg);
      }

      sfx.playSuccess();
      setConfirmationData({
        id: data.id || 'ECHO-SECURE-SIGNAL',
        timestamp: data.timestamp || new Date().toLocaleString(),
        name: payload.name,
        age: payload.age,
        location: payload.location,
        email: payload.email,
        problem: payload.problem,
        emailSent: data.emailSent,
        mode: data.mode
      });
      setStep('done');
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      console.error('[AskElyvex] Submission failed:', err);
      setSubmissionError(err.message || 'Transmission failed. Unable to dispatch email notification.');
      setStep('error');
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    setValidationError('');

    // Step-by-step client validation
    if (step === 'name') {
      if (val.length < 2) {
        setValidationError('Please share a name or pseudonym so Elyvex knows who she is talking with.');
        return;
      }
      sfx.playBlip(600, 'sine', 0.06);
      setFormData((prev) => ({ ...prev, name: val }));
      setInputValue('');
      setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: val }]);

      setTimeout(() => {
        setStep('age');
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, from: 'bot', text: `Nice to meet you, ${val}. How old are you?` }
        ]);
      }, 400);
    } else if (step === 'age') {
      const numAge = parseInt(val, 10);
      if (isNaN(numAge) || numAge < 1 || numAge > 125) {
        setValidationError('Please enter a valid age between 1 and 125 (e.g. 24).');
        return;
      }
      sfx.playBlip(600, 'sine', 0.06);
      setFormData((prev) => ({ ...prev, age: numAge }));
      setInputValue('');
      setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: val }]);

      setTimeout(() => {
        setStep('location');
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, from: 'bot', text: 'Where are you currently located?' }
        ]);
      }, 400);
    } else if (step === 'location') {
      if (val.length < 2) {
        setValidationError('Please provide your city, region, or general location.');
        return;
      }
      sfx.playBlip(600, 'sine', 0.06);
      setFormData((prev) => ({ ...prev, location: val }));
      setInputValue('');
      setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: val }]);

      setTimeout(() => {
        setStep('email');
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, from: 'bot', text: 'Where can I reach you if I need to follow up?' }
        ]);
      }, 400);
    } else if (step === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setValidationError('Please enter a valid email address (e.g. citizen@example.com).');
        return;
      }
      sfx.playBlip(600, 'sine', 0.06);
      setFormData((prev) => ({ ...prev, email: val }));
      setInputValue('');
      setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: val }]);

      setTimeout(() => {
        setStep('problem');
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            from: 'bot',
            text: "Forget the forms. You don't need the perfect words. Just tell me what happened. How can I help?"
          }
        ]);
      }, 450);
    } else if (step === 'problem') {
      if (val.length < 5) {
        setValidationError('Please share a few details about what happened so Elyvex can understand.');
        return;
      }
      sfx.playBlip(650, 'triangle', 0.08);
      const finalPayload = { ...formData, problem: val };
      setFormData(finalPayload);
      setInputValue('');
      setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: val }]);

      await submitPayload(finalPayload);
    }
  };

  const handleRetry = () => {
    sfx.playBlip(600, 'sine', 0.06);
    if (formData.name && formData.age && formData.location && formData.email && formData.problem) {
      submitPayload(formData);
    } else {
      setStep('problem');
    }
  };

  const resetForm = () => {
    sfx.playBlip(550, 'sine', 0.05);
    setFormData({ name: '', age: '', location: '', email: '', problem: '' });
    setInputValue('');
    setValidationError('');
    setSubmissionError('');
    setStep('name');
    setMessages([
      {
        id: 1,
        from: 'bot',
        text: "Hey. I'm Elyvex. You don't have to face everything alone."
      },
      {
        id: 2,
        from: 'bot',
        text: "First, what should I call you?"
      }
    ]);
  };

  return (
    <div className="page-wrapper" aria-label="Ask Elyvex Help Portal">
      {/* Header Banner */}
      <section className="page-header-section" style={{ paddingBottom: '30px' }}>
        <div className="section-eyebrow">
          <Zap size={14} />
          <span>DIRECT HUMAN-FIRST INTERFACE</span>
        </div>
        <h1 className="page-title-main">
          Ask <span className="cyan-text">Elyvex.</span>
        </h1>
        <p className="page-lead-subtitle">
          Whatever you're facing, start here. Tell Elyvex what happened in your own words.
        </p>
      </section>

      {/* Main Conversational Box, Error State, or Success Screen */}
      <section className="site-section" style={{ paddingTop: '10px' }}>
        {step !== 'done' && step !== 'error' ? (
          <div className="chat-portal-container">
            {/* Top Command Bar */}
            <div className="chat-portal-header">
              <div className="chat-header-identity">
                <div className="chat-avatar-thumb">
                  <img src="/elyvex_avatar.jpg" alt="Elyvex Portrait" />
                </div>
                <div>
                  <strong style={{ fontFamily: 'var(--font-hud)', fontSize: '14px', letterSpacing: '0.15em', color: '#ffffff' }}>
                    ELYVEX
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#10b981' }}>
                    <span className="live-pulse-dot" />
                    <span>Echo Hub // Online & Listening</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Stream */}
            <div className="chat-portal-stream" ref={chatStreamRef} role="log" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble-row ${msg.from}`}>
                  {msg.from === 'bot' && (
                    <div className="chat-avatar-mini">
                      <img src="/elyvex_avatar.jpg" alt="Elyvex Avatar" />
                    </div>
                  )}
                  <div className={`chat-bubble ${msg.from}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {step === 'submitting' && (
                <div className="chat-submitting-state">
                  <div className="quantum-spinner" />
                  <div className="submitting-text-flow">
                    <strong>SIGNAL IN TRANSIT</strong>
                    <span>{loadingText}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Alert */}
            {validationError && (
              <div className="chat-validation-alert" role="alert">
                <AlertTriangle size={16} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Input Bar */}
            {step !== 'submitting' && (
              <form className="chat-portal-input-bar" onSubmit={handleSend}>
                <input
                  type={step === 'email' ? 'email' : step === 'age' ? 'number' : 'text'}
                  className="chat-portal-input-field"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder={
                    step === 'name'
                      ? "Type your name or pseudonym..."
                      : step === 'age'
                      ? "Type your age (e.g. 21)..."
                      : step === 'location'
                      ? "Type your city or location..."
                      : step === 'email'
                      ? "Type your email address (e.g. name@example.com)..."
                      : "Tell Elyvex what happened..."
                  }
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!inputValue.trim()}
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            )}

            {/* Privacy Disclaimer */}
            <div className="chat-privacy-footer">
              <Shield size={12} />
              <span>Your information is used strictly to process this help request. No tracking. No commercial telemetry.</span>
            </div>
          </div>
        ) : step === 'error' ? (
          /* ================================================================
             SUBMISSION ERROR STATE
             ================================================================ */
          <div className="cinematic-success-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }} role="alert">
            <div className="success-beacon-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444' }}>
              <AlertCircle size={44} color="#ef4444" />
            </div>

            <div className="success-signal-tag" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <span className="live-pulse-dot" style={{ background: '#ef4444' }} />
              <span>TRANSMISSION ENCOUNTERED AN ISSUE</span>
            </div>

            <h2 className="success-main-headline" style={{ color: '#ffffff' }}>
              Submission Failed to Dispatch
            </h2>
            <p className="success-sub-lead" style={{ color: '#fca5a5' }}>
              {submissionError || 'The Echo Hub backend could not deliver the notification email. Please check your connection or backend SMTP configuration.'}
            </p>

            <div className="success-dossier-receipt" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: '#090d16' }}>
              <div className="receipt-header">
                <span>DRAFT DETAILS PRESERVED</span>
                <strong style={{ color: '#ef4444' }}>READY TO RETRY</strong>
              </div>
              <div className="receipt-grid">
                <div>
                  <span className="r-label">VISITOR:</span>
                  <strong className="r-val">{formData.name || 'Not provided'}</strong>
                </div>
                <div>
                  <span className="r-label">EMAIL:</span>
                  <strong className="r-val">{formData.email || 'Not provided'}</strong>
                </div>
                <div>
                  <span className="r-label">LOCATION:</span>
                  <strong className="r-val">{formData.location || 'Not provided'}</strong>
                </div>
                <div>
                  <span className="r-label">STATUS:</span>
                  <strong className="r-val" style={{ color: '#ef4444' }}>AWAITING RETRY</strong>
                </div>
              </div>
            </div>

            <div className="success-action-buttons">
              <button
                className="cta-primary-hero"
                onClick={handleRetry}
                style={{ background: '#ef4444', color: '#ffffff', borderColor: '#f87171' }}
              >
                <RefreshCw size={18} />
                <span>RETRY TRANSMISSION</span>
              </button>
              <button
                className="cta-secondary-hero"
                onClick={() => setStep('problem')}
              >
                <RotateCcw size={16} />
                <span>EDIT GRIEVANCE / DETAILS</span>
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================
             CINEMATIC CONFIRMATION / SUCCESS STATE
             ================================================================ */
          <div className="cinematic-success-card" role="status">
            <div className="success-neural-glow" />
            
            <div className="success-beacon-icon">
              <CheckCircle2 size={44} color="#00f0ff" />
            </div>

            <div className="success-signal-tag">
              <span className="live-pulse-dot" />
              <span>ECHO CONNECTION ESTABLISHED & EMAIL NOTIFICATION DISPATCHED</span>
            </div>

            <h2 className="success-main-headline">
              🦸 Grievance Submitted Successfully!
            </h2>
            <p className="success-sub-lead">
              "An automated email notification with your details has been dispatched to Dr. Elyvex. You are no longer alone."
            </p>

            {confirmationData && (
              <div className="success-dossier-receipt">
                <div className="receipt-header">
                  <span>INCIDENT REFERENCE IDENTIFIER</span>
                  <strong>{confirmationData.id}</strong>
                </div>
                <div className="receipt-grid">
                  <div>
                    <span className="r-label">VISITOR NAME:</span>
                    <strong className="r-val">{confirmationData.name}</strong>
                  </div>
                  <div>
                    <span className="r-label">AGE:</span>
                    <strong className="r-val">{confirmationData.age}</strong>
                  </div>
                  <div>
                    <span className="r-label">LOCATION:</span>
                    <strong className="r-val">{confirmationData.location}</strong>
                  </div>
                  <div>
                    <span className="r-label">EMAIL ADDRESS:</span>
                    <strong className="r-val">{confirmationData.email}</strong>
                  </div>
                  <div>
                    <span className="r-label">DATE & TIME:</span>
                    <strong className="r-val">{confirmationData.timestamp}</strong>
                  </div>
                  <div>
                    <span className="r-label">EMAIL STATUS:</span>
                    <strong
                      className="r-val"
                      style={{ color: confirmationData.emailSent ? '#10b981' : '#f59e0b' }}
                    >
                      {confirmationData.emailSent
                        ? 'DISPATCHED TO INBOX'
                        : 'LOGGED (GMAIL DAILY LIMIT HIT)'}
                    </strong>
                  </div>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
                  <span className="r-label" style={{ display: 'block', marginBottom: '4px' }}>GRIEVANCE / REQUEST SUMMARY:</span>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#e2e8f0', lineHeight: 1.5 }}>
                    {confirmationData.problem}
                  </p>
                </div>
              </div>
            )}

            <div className="success-action-buttons">
              <Link
                to="/echo-hub"
                className="cta-primary-hero"
                onClick={() => sfx.playBlip(600, 'sine', 0.05)}
              >
                <span>RETURN TO ECHO HUB</span>
                <ArrowRight size={18} />
              </Link>
              <button
                className="cta-secondary-hero"
                onClick={resetForm}
              >
                <RotateCcw size={16} />
                <span>SUBMIT ANOTHER GRIEVANCE</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

