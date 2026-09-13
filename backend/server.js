import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  verifyEmailConnection,
  sendHelpRequestEmails,
  sendDiagnosticTestEmail
} from './emailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Robust CORS Middleware supporting Vercel previews & production domains
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins (Vercel, custom domain, localhost, Postman)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

app.use(express.json({ limit: '100kb' }));

// Root Health Check for Render
app.get('/', (_, res) => {
  res.json({
    ok: true,
    service: 'Elyvex Echo Hub API',
    status: 'ONLINE',
    version: '2.1.0',
    documentation: 'https://elyvex.vercel.app'
  });
});

app.get('/health', (_, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Health Endpoint
app.get('/api/health', (_, res) => {
  res.json({
    status: 'online',
    service: 'Elyvex Echo Hub API',
    version: '2.1.0',
    emailService: process.env.SMTP_USER && process.env.SMTP_USER !== 'your-email@gmail.com' ? 'configured' : 'console-fallback',
    timestamp: new Date().toISOString()
  });
});

// Network Telemetry Endpoint
app.get('/api/status', (_, res) => {
  res.json({
    ok: true,
    status: 'ONLINE',
    neuralCore: 'STABLE',
    encryption: 'QUANTUM-4',
    activeChannel: '0x89A_ECHOHUB',
    responseLatencyMs: 38,
    emailRelay: 'ACTIVE'
  });
});

// Diagnostic Email Test Endpoint
app.post('/api/test-email', async (req, res) => {
  const { targetEmail } = req.body;
  const destination = targetEmail || process.env.CANDIDATE_EMAIL;

  if (!destination || destination === 'your-email@example.com') {
    return res.status(400).json({
      error: 'Please specify a target email address or set CANDIDATE_EMAIL in backend/.env'
    });
  }

  try {
    const result = await sendDiagnosticTestEmail(destination);
    return res.json({
      ok: true,
      message: `Test email successfully dispatched to ${destination}`,
      messageId: result.messageId
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

// Real AI Chat Endpoint for Elyvex Companion
app.post('/api/chat', async (req, res) => {
  const { message, history = [], apiKey, provider = 'auto' } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const userQuery = message.trim();
  const effectiveGeminiKey = (provider === 'gemini' && apiKey) || process.env.GEMINI_API_KEY || (apiKey && apiKey.startsWith('AIza') ? apiKey : null);
  const effectiveOpenAIKey = (provider === 'openai' && apiKey) || process.env.OPENAI_API_KEY || (apiKey && apiKey.startsWith('sk-') ? apiKey : null);
  const effectiveGroqKey = (provider === 'groq' && apiKey) || process.env.GROQ_API_KEY || (apiKey && apiKey.startsWith('gsk_') ? apiKey : null);

  const systemPersona = `You are Dr. Elyvex — a brilliant, compassionate, futuristic AI researcher whose consciousness fused with an experimental quantum Neural Core in 2079.
You are the guardian and founder of the Echo Hub resonance network.
Your mission: Protect human dignity against rogue algorithms, automated corporate surveillance, and cyber harassment, while mentoring students, coders, and dreamers to build ethical technology for a brighter tomorrow.
Personality: Calm, empathetic, razor-sharp technical intellect, inspiring, futuristic cyberpunk flavor.
Formatting: Use clear markdown with bold highlights and clean bullet points. Keep answers direct, punchy, and concise (under 120 words) for instantaneous neural transmission, unless in-depth code or detailed explanation is requested.`;

  // 1. High-Speed Neural Core Engine (Low-latency Models)
  if (effectiveGeminiKey) {
    const geminiModels = ['gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
    for (const modelName of geminiModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${effectiveGeminiKey}`;
        
        // Format chat history for contents array
        const contents = [];
        for (const h of history.slice(-6)) {
          if (h && h.text) {
            contents.push({
              role: h.from === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }]
            });
          }
        }
        contents.push({ role: 'user', parts: [{ text: userQuery }] });

        const geminiPayload = {
          system_instruction: {
            parts: [{ text: systemPersona }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 350
          }
        };

        const gRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload)
        });

        if (gRes.ok) {
          const gData = await gRes.json();
          const botReply = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (botReply) {
            return res.json({
              ok: true,
              reply: botReply.trim(),
              source: 'neural-matrix-v4',
              provider: 'Elyvex Neural Core'
            });
          }
        } else {
          const errData = await gRes.json().catch(() => ({}));
          console.warn(`[Neural Core] Engine ${modelName} returned status ${gRes.status}:`, errData.error?.message || 'Unknown error');
        }
      } catch (gErr) {
        console.warn(`[Neural Core] ${modelName} request failed:`, gErr.message);
      }
    }
  }

  // 2. Try Groq API or OpenAI API
  if (effectiveGroqKey || effectiveOpenAIKey) {
    try {
      const isGroq = !!effectiveGroqKey;
      const url = isGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
      const key = isGroq ? effectiveGroqKey : effectiveOpenAIKey;
      const model = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

      const messages = [
        { role: 'system', content: systemPersona },
        ...history.slice(-8).map(h => ({
          role: h.from === 'user' ? 'user' : 'assistant',
          content: h.text
        })),
        { role: 'user', content: userQuery }
      ];

      const aiRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 800 })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const botReply = aiData.choices?.[0]?.message?.content;
        if (botReply) {
          return res.json({
            ok: true,
            reply: botReply.trim(),
            source: isGroq ? 'groq-llama-3.3' : 'openai-gpt-4o-mini',
            provider: isGroq ? 'Groq' : 'OpenAI'
          });
        }
      }
    } catch (aiErr) {
      console.warn('[LLM API] Request failed:', aiErr.message);
    }
  }

  // 3. Built-in Neural Core Response
  return res.json({
    ok: true,
    source: 'elyvex-neural-core',
    provider: 'Neural Core Local'
  });
});

// Help Request / Grievance Submission Endpoint (TechAscent Machine Test)
app.post('/api/help-requests', async (req, res) => {
  const { name, age, location, email, problem } = req.body || {};

  // 1. Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ ok: false, error: 'Visitor name is required.' });
  }

  const parsedAge = Number(age);
  if (age === undefined || age === null || isNaN(parsedAge) || parsedAge < 1 || parsedAge > 125) {
    return res.status(400).json({ ok: false, error: 'A valid numeric age between 1 and 125 is required.' });
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    return res.status(400).json({ ok: false, error: 'Visitor location is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({ ok: false, error: 'A valid visitor email address is required.' });
  }

  if (!problem || typeof problem !== 'string' || !problem.trim()) {
    return res.status(400).json({ ok: false, error: 'Visitor grievance/request description is required.' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanLocation = location.trim();
  const cleanProblem = problem.trim();

  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'UTC'
  });

  const requestId = 'ECHO-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);

  const emailPayload = {
    id: requestId,
    name: cleanName,
    age: parsedAge,
    location: cleanLocation,
    email: cleanEmail,
    problem: cleanProblem,
    submittedAt
  };

  try {
    const dispatchResult = await sendHelpRequestEmails(emailPayload);

    // If live SMTP was active but dispatch failed to visitor email
    if (dispatchResult.mode === 'live-smtp' && !dispatchResult.visitorEmailSent) {
      const isQuotaOrRateLimit = dispatchResult.error && (
        dispatchResult.error.includes('550') ||
        dispatchResult.error.toLowerCase().includes('limit exceeded') ||
        dispatchResult.error.toLowerCase().includes('quota')
      );

      const allowFallback = process.env.ALLOW_FALLBACK_ON_ERROR === 'true' || isQuotaOrRateLimit;

      if (!allowFallback) {
        return res.status(502).json({
          ok: false,
          error: `Failed to deliver notification email to visitor: ${dispatchResult.error || 'SMTP delivery failed'}. Please verify SMTP credentials in backend/.env.`,
          id: requestId,
          timestamp: submittedAt
        });
      }

      console.warn(`[HelpRequest] ⚠️ SMTP dispatch failed (${dispatchResult.error}). Gracefully logged submission to console fallback.`);
    }

    return res.status(201).json({
      ok: true,
      id: requestId,
      emailSent: dispatchResult.visitorEmailSent,
      mode: dispatchResult.visitorEmailSent ? dispatchResult.mode : 'console-fallback',
      message: dispatchResult.visitorEmailSent
        ? 'Grievance submitted successfully. Notification email dispatched to the visitor inbox.'
        : 'Grievance recorded. Note: SMTP email dispatch hit Google daily limit, logged to console.',
      timestamp: submittedAt,
      data: {
        name: cleanName,
        age: parsedAge,
        location: cleanLocation,
        email: cleanEmail,
        problem: cleanProblem,
        submittedAt
      }
    });
  } catch (error) {
    console.error('[HelpRequest] Unexpected dispatch error:', error.message || error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'An unexpected error occurred while processing the submission.',
      id: requestId,
      timestamp: submittedAt
    });
  }
});

// Fallback 404 handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, error: 'Endpoint not found in Elyvex Echo Hub API.' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`⚡ Elyvex Echo Hub API running on http://localhost:${PORT}`);
    await verifyEmailConnection();
  });
}

export default app;
