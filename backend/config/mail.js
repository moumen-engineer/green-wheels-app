const nodemailer = require('nodemailer');

/**
 * Builds the transporter used for password reset (and future mail).
 * Gmail: use EMAIL_SERVICE=gmail or EMAIL_HOST=smtp.gmail.com — uses Nodemailer's
 * built-in Gmail settings (STARTTLS on 587), which is more reliable than manual host/port.
 */
function getMailTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  const pass = String(process.env.EMAIL_PASS).replace(/\s+/g, '');
  const host = (process.env.EMAIL_HOST || '').toLowerCase();
  const useGmail =
    process.env.EMAIL_SERVICE === 'gmail' ||
    host === 'smtp.gmail.com' ||
    host.endsWith('.gmail.com');

  if (useGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass,
      },
    });
  }

  if (!process.env.EMAIL_HOST) {
    return null;
  }

  const port = Number(process.env.EMAIL_PORT) || 587;
  const secure =
    process.env.EMAIL_SECURE === 'true' || String(process.env.EMAIL_SECURE) === '1' || port === 465;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass,
    },
    requireTLS: !secure && port === 587,
    tls: {
      rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false',
    },
  });
}

async function verifyMailTransport() {
  const t = getMailTransporter();
  if (!t) {
    return { ok: false, skip: true, message: 'SMTP non configuré (EMAIL_USER / EMAIL_PASS manquants).' };
  }
  await t.verify();
  return { ok: true, skip: false };
}

module.exports = { getMailTransporter, verifyMailTransport };
