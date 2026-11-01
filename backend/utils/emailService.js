const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10) || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || '"LibraMind Sanctuary" <noreply@libramind.edu>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5000';

function isConfigured() {
  return Boolean(EMAIL_HOST && EMAIL_USER && EMAIL_PASSWORD);
}

let transporter = null;

if (isConfigured()) {
  try {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
  } catch (err) {
    console.error('[EmailService] Failed to initialize SMTP transport:', err.message);
  }
}

/**
 * Send Password Reset Email with responsive biophilic HTML template
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string} options.token - Plain reset token for link
 * @param {number} [options.expiresInMinutes=30]
 */
async function sendPasswordResetEmail({ to, name, token, expiresInMinutes = 30 }) {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

  if (!isConfigured() || !transporter) {
    console.log(
      `[EmailService] Password reset requested for "${to}". Live SMTP is not configured. To send real emails, set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD in backend/.env.`
    );
    return {
      sent: false,
      emailConfigured: false,
      reason: 'SMTP is not configured in environment variables'
    };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your LibraMind Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F1; color: #26352B; margin: 0; padding: 24px; }
          .card { max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid rgba(52, 78, 65, 0.15); box-shadow: 0 4px 20px rgba(52, 78, 65, 0.08); overflow: hidden; }
          .header { background: linear-gradient(135deg, #23342B 0%, #344E41 100%); padding: 32px 24px; text-align: center; color: #FAF8F1; }
          .logo-badge { display: inline-block; background-color: rgba(255, 255, 255, 0.15); padding: 4px 14px; border-radius: 20px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; margin-bottom: 8px; }
          .title { font-family: Georgia, serif; font-size: 26px; margin: 0; font-weight: bold; }
          .content { padding: 32px 28px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 700; color: #23342B; margin-bottom: 12px; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn-reset { display: inline-block; background: linear-gradient(135deg, #344E41 0%, #52734D 100%); color: #FAF8F1 !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 14px rgba(52, 78, 65, 0.25); }
          .alt-link { font-size: 12px; color: #5A6D5E; word-break: break-all; background: #F3EBDD; padding: 10px 14px; border-radius: 8px; }
          .footer { padding: 20px 28px; background-color: #F8FBF6; border-top: 1px solid rgba(52, 78, 65, 0.1); font-size: 12px; color: #829779; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="logo-badge">Security Service</span>
            <h1 class="title">LibraMind Sanctuary</h1>
          </div>
          <div class="content">
            <p class="greeting">Hello ${name || 'Reader'},</p>
            <p>We received a request to reset the password for your LibraMind account. Click the button below to choose a new password:</p>
            <div class="btn-container">
              <a href="${resetUrl}" class="btn-reset" target="_blank">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #5A6D5E;">This password reset link is valid for <strong>${expiresInMinutes} minutes</strong> and can only be used once.</p>
            <p style="font-size: 12px; color: #829779;">If the button above does not work, copy and paste this link into your browser:</p>
            <div class="alt-link">${resetUrl}</div>
            <p style="font-size: 12px; color: #829779; margin-top: 24px;">If you did not request this password reset, please ignore this email. Your existing password and account remain completely secure.</p>
          </div>
          <div class="footer">
            LibraMind Smart Library Management System · Biophilic Reading Sanctuary<br />
            Need assistance? Contact our desk team at circulation@libramind.edu
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `Hello ${name || 'Reader'},\n\nWe received a request to reset your LibraMind account password.\n\nPlease visit the link below to choose a new password:\n${resetUrl}\n\nThis link will expire in ${expiresInMinutes} minutes.\n\nIf you did not request a password reset, you can safely ignore this email.\n\nBest regards,\nLibraMind Library Sanctuary Team`;

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject: 'Reset Your LibraMind Password',
      text: textContent,
      html: htmlContent
    });

    return {
      sent: true,
      emailConfigured: true,
      messageId: info.messageId
    };
  } catch (err) {
    console.error('[EmailService] Error dispatching email:', err.message);
    return {
      sent: false,
      emailConfigured: true,
      error: err.message
    };
  }
}

module.exports = {
  isConfigured,
  sendPasswordResetEmail,
  FRONTEND_URL
};

