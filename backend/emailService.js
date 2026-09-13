import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env first, then root .env or process.env
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

/**
 * Creates and configures the Nodemailer transporter using SMTP environment variables.
 */
function createTransporter() {
  const smtpUser = process.env.SMTP_USER;
  let smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE).toLowerCase() === 'true';

  const isPlaceholder = !smtpUser || !smtpPass ||
    smtpUser === 'your-email@gmail.com' ||
    smtpUser.includes('example.com') ||
    smtpPass === 'your-app-password';

  if (isPlaceholder) {
    return null;
  }

  // Remove spaces if user copied 16-character Google App Password with spaces (e.g. "xxxx yyyy zzzz wwww")
  if (typeof smtpPass === 'string') {
    smtpPass = smtpPass.replace(/\s+/g, '');
  }

  const isGmail = smtpHost.includes('gmail');

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      connectionTimeout: 8000,
      greetingTimeout: 5000,
      socketTimeout: 8000
    });
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 8000,
    greetingTimeout: 5000,
    socketTimeout: 8000
  });
}

/**
 * Verifies SMTP connection on startup.
 */
export async function verifyEmailConnection() {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[EmailService] Running in DEV / CONSOLE FALLBACK mode (Configure real SMTP_PASS in backend/.env for live inbox dispatch).');
    return { configured: false, mode: 'console-fallback' };
  }

  try {
    await transporter.verify();
    console.log('[EmailService] ✅ SMTP Transporter verified and ready to dispatch live emails.');
    return { configured: true, mode: 'live-smtp' };
  } catch (error) {
    console.warn('[EmailService] ⚠️ SMTP Transporter verification failed:', error.message);
    return { configured: false, mode: 'smtp-error', error: error.message };
  }
}

/**
 * Generates responsive HTML email template sent to the Visitor from Elyvex / Candidate.
 * Contains: Visitor name, Age, Location, Email address, Grievance/request, Submission date & time
 */
function buildVisitorEmailHtml({ id, name, age, location, email, problem, submittedAt }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🦸 Someone Needs Your Help!</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #020611;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #e2e8f0;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #061426;
        border: 1px solid #00f0ff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 240, 255, 0.2);
      }
      .email-header {
        background: linear-gradient(135deg, #0b2545, #020611);
        padding: 26px 24px;
        border-bottom: 2px solid #00f0ff;
        text-align: center;
      }
      .email-header h1 {
        margin: 8px 0 6px 0;
        color: #ffffff;
        font-size: 22px;
        letter-spacing: 0.05em;
      }
      .email-badge {
        display: inline-block;
        background: rgba(0, 240, 255, 0.15);
        border: 1px solid #00f0ff;
        color: #00f0ff;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }
      .email-body {
        padding: 24px;
        line-height: 1.6;
      }
      .quote-banner {
        background: rgba(0, 240, 255, 0.08);
        border-left: 3px solid #00f0ff;
        padding: 14px 18px;
        margin: 16px 0 22px 0;
        font-style: italic;
        color: #e0f2fe;
        border-radius: 0 6px 6px 0;
      }
      .info-grid {
        background: #020611;
        border: 1px solid rgba(56, 189, 248, 0.25);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
      }
      .info-row {
        display: flex;
        padding: 9px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .info-row:last-child {
        border-bottom: none;
      }
      .info-label {
        width: 170px;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
      }
      .info-val {
        flex: 1;
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
      }
      .problem-box {
        background: rgba(0, 240, 255, 0.04);
        border-left: 4px solid #00f0ff;
        padding: 16px;
        border-radius: 0 8px 8px 0;
        margin-bottom: 24px;
      }
      .problem-box h3 {
        margin: 0 0 8px 0;
        color: #00f0ff;
        font-size: 14px;
        text-transform: uppercase;
      }
      .problem-box p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: #f1f5f9;
        white-space: pre-wrap;
      }
      .email-footer {
        background: #020611;
        padding: 18px 24px;
        border-top: 1px solid rgba(56, 189, 248, 0.2);
        font-size: 12px;
        color: #64748b;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <span class="email-badge">HERO RESPONSE NETWORK</span>
        <h1>🦸 Someone Needs Your Help!</h1>
        <p style="margin: 6px 0 0 0; color: #38bdf8; font-size: 13px;">Incident Reference ID: <strong>${id}</strong></p>
      </div>
      <div class="email-body">
        <p style="font-size: 15px; margin: 0 0 10px 0;">Dear <strong>${name}</strong>,</p>
        <p style="margin: 0 0 16px 0; color: #cbd5e1;">Your grievance/request has been safely received through the Elyvex Echo Hub superhero network. You don't have to face this alone.</p>

        <div class="quote-banner">
          "Someone needs help. I'm already listening. Take a breath — we will get through this together."<br>
          <span style="font-size: 12px; color: #38bdf8; font-style: normal; font-weight: 600;">— Dr. Elyvex</span>
        </div>

        <p style="font-weight: 700; color: #00f0ff; font-size: 13px; text-transform: uppercase; margin: 20px 0 8px 0;">SUBMITTED DETAILS RECEIPT:</p>
        
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Visitor Name:</span>
            <span class="info-val">${name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Age:</span>
            <span class="info-val">${age}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Location:</span>
            <span class="info-val">${location}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email Address:</span>
            <span class="info-val"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></span>
          </div>
          <div class="info-row">
            <span class="info-label">Submission Date & Time:</span>
            <span class="info-val">${submittedAt}</span>
          </div>
        </div>

        <div class="problem-box">
          <h3>Your Grievance / Request:</h3>
          <p>${problem}</p>
        </div>

        <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8;">
          Our response team and Dr. Elyvex are reviewing your transmission. Keep your Incident Reference ID (<strong>${id}</strong>) safe for any follow-up.
        </p>
      </div>
      <div class="email-footer">
        <p style="margin: 0 0 4px 0;">Elyvex Echo Hub Automated Dispatch System</p>
        <p style="margin: 0;">"Technology should help humanity, never control it."</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Core Email Dispatch Service
 * Sends email automatically FROM candidate's email (SMTP_USER) TO the visitor's collected email address,
 * with candidate's personal email CC'd.
 */
export async function sendHelpRequestEmails(data) {
  const { id, name, age, location, email, problem, submittedAt } = data;
  const smtpUser = process.env.SMTP_USER;
  const candidateEmail = process.env.CANDIDATE_EMAIL || smtpUser;

  const transporter = createTransporter();

  const plainText = [
    '==================================================',
    '🦸 SOMEONE NEEDS YOUR HELP! — ELYVEX ECHO HUB',
    '==================================================',
    `Incident Reference ID: ${id}`,
    `Submission Date & Time: ${submittedAt}`,
    '',
    `Dear ${name},`,
    '',
    'Your grievance/request has been safely received through the Elyvex Echo Hub superhero network.',
    '',
    'VISITOR DETAILS:',
    `• Visitor Name: ${name}`,
    `• Age: ${age}`,
    `• Location: ${location}`,
    `• Email Address: ${email}`,
    '',
    'GRIEVANCE / REQUEST:',
    '--------------------------------------------------',
    problem,
    '--------------------------------------------------',
    '',
    'MESSAGE FROM DR. ELYVEX:',
    '"Someone needs help. I am already listening. Take a breath — we will get through this together."',
    '',
    '--------------------------------------------------',
    'Elyvex Echo Hub • Civilian Defense Network'
  ].join('\n');

  // Fallback if no SMTP credentials configured
  if (!transporter || !smtpUser || smtpUser === 'your-email@gmail.com') {
    console.log('\n==================================================');
    console.log('⚡ [EMAIL SERVICE — DEV CONSOLE NOTIFICATION]');
    console.log('==================================================');
    console.log(`From (Candidate): ${smtpUser || 'NOT SET'}`);
    console.log(`To (Visitor's Collected Email): ${email}`);
    if (candidateEmail && candidateEmail !== email) {
      console.log(`CC (Candidate Inbox): ${candidateEmail}`);
    }
    console.log(`Subject: 🦸 Someone Needs Your Help!`);
    console.log(plainText);
    console.log('==================================================\n');

    return {
      visitorEmailSent: false,
      adminEmailSent: false,
      mode: 'console-fallback',
      id
    };
  }

  let visitorEmailSent = false;
  let adminEmailSent = false;
  let dispatchError = null;

  // 1. Dispatch Email FROM Candidate's SMTP Email TO the Visitor's Collected Email (with Candidate CC'd)
  try {
    const mailOptions = {
      from: `"Dr. Elyvex (Echo Hub)" <${smtpUser}>`,
      to: email,
      replyTo: smtpUser,
      subject: "🦸 Someone Needs Your Help!",
      text: plainText,
      html: buildVisitorEmailHtml(data)
    };

    // If candidate email is distinct from visitor email, add CC so candidate also has the record
    if (candidateEmail && candidateEmail.toLowerCase() !== email.toLowerCase()) {
      mailOptions.cc = candidateEmail;
    }

    const info = await transporter.sendMail(mailOptions);
    visitorEmailSent = true;
    adminEmailSent = true;
    console.log(`[EmailService] ✅ Email successfully sent FROM ${smtpUser} TO visitor (${email}) [CC: ${candidateEmail || 'none'}] — Message ID: ${info.messageId}`);
  } catch (err) {
    dispatchError = err.message;
    console.error(`\n[EmailService] ❌ Failed to dispatch email via SMTP to visitor (${email}):`, err.message);
    console.log('⚡ [EmailService] Preserving submission transcript in console:');
    console.log(plainText);
    console.log('--------------------------------------------------\n');
  }

  return {
    visitorEmailSent,
    adminEmailSent,
    mode: 'live-smtp',
    error: dispatchError,
    id
  };
}

/**
 * Diagnostic test email function
 */
export async function sendDiagnosticTestEmail(targetEmail) {
  const transporter = createTransporter();
  const smtpUser = process.env.SMTP_USER;

  if (!transporter) {
    throw new Error('SMTP credentials not configured in backend/.env (SMTP_USER and SMTP_PASS required).');
  }

  const result = await transporter.sendMail({
    from: `"Elyvex Echo Hub Diagnostics" <${smtpUser}>`,
    to: targetEmail,
    subject: `⚡ [TEST PING] Elyvex Echo Hub Email Service Diagnostic`,
    text: `This is a verified test email from the Elyvex Echo Hub email service.\nTimestamp: ${new Date().toISOString()}`,
    html: `
      <div style="background: #020611; color: #ffffff; padding: 24px; font-family: sans-serif; border: 1px solid #00f0ff; border-radius: 8px;">
        <h2 style="color: #00f0ff;">⚡ ELYVEX ECHO HUB — EMAIL TEST</h2>
        <p>Your SMTP configuration is active and working successfully.</p>
        <p style="color: #94a3b8; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>
      </div>
    `
  });

  return result;
}


