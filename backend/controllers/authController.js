const User = require('../models/User');
const crypto = require('crypto');
const { getMailTransporter } = require('../config/mail');

// ─── REGISTER ─────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    // Create user
    const newUser = await User.create({ full_name, email, password, phone });

    // Store in session with proper structure
    req.session.user = {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: 'user'
    };

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: { id: newUser.id, full_name: newUser.full_name, email: newUser.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await User.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Store in session with proper structure
    req.session.user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    };

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out.' });
    }
    res.clearCookie('gw_session', {
      path: '/',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  });
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    // Always return success to avoid email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'Si cet e-mail est enregistré, un lien de réinitialisation a été envoyé.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.saveResetToken(email, resetToken, expires);

    const clientBase = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetURL = `${clientBase.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

    const isProd = process.env.NODE_ENV === 'production';
    const transporter = getMailTransporter();
    let mailSent = false;

    if (transporter) {
      try {
        const fromAddr = process.env.EMAIL_FROM || process.env.EMAIL_USER;
        const info = await transporter.sendMail({
          from: `"Green Wheels" <${fromAddr}>`,
          to: email,
          replyTo: process.env.EMAIL_USER,
          subject: 'Green Wheels — Password reset / Mot de passe',
          text: `Réinitialisez votre mot de passe (lien valable 1 h) :\n${resetURL}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.`,
          html: `
        <h2>Réinitialisation du mot de passe</h2>
        <p>Vous avez demandé une réinitialisation. Ouvrez le lien ci-dessous :</p>
        <p><a href="${resetURL}" style="
          display:inline-block;
          padding:12px 24px;
          background:#22c55e;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        ">Réinitialiser le mot de passe</a></p>
        <p>Ou copiez cette adresse dans votre navigateur :<br/><span style="word-break:break-all">${resetURL}</span></p>
        <p>Ce lien expire dans <strong>1 heure</strong>.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail.</p>
      `,
        });
        mailSent = true;
        console.log(
          '[Green Wheels] Reset email accepted by SMTP. messageId=',
          info.messageId,
          'to=',
          email,
          'accepted=',
          info.accepted,
          info.rejected?.length ? `rejected=${info.rejected}` : ''
        );
      } catch (err) {
        console.error('[Green Wheels] Password reset email failed:', err.message);
        if (err.response) {
          console.error('[Green Wheels] SMTP response:', err.response);
        }
        if (!isProd) {
          console.log('[Green Wheels] Dev fallback — reset link:', resetURL);
        }
      }
    } else if (!isProd) {
      console.log('[Green Wheels] SMTP non configuré — lien de reset :', resetURL);
    }

    const payload = {
      success: true,
      message: mailSent
        ? 'Si cet e-mail est enregistré, un lien de réinitialisation a été envoyé. Vérifiez aussi les courriers indésirables.'
        : 'Si cet e-mail est enregistré, un lien de réinitialisation a été envoyé.',
    };

    if (!isProd && !mailSent) {
      payload.devResetUrl = resetURL;
      payload.devHint =
        transporter == null
          ? 'SMTP non configuré : utilisez le lien ci-dessous (développement uniquement).'
          : "L'envoi d'e-mail a échoué : utilisez le lien ci-dessous (développement uniquement).";
    }

    return res.status(200).json(payload);
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    await User.updatePassword(user.id, password);

    return res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── GET CURRENT USER (me) ────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── CREATE ADMIN (for seeding) ────────────────────────────────────────────────
exports.createAdmin = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    // Create admin user
    const adminUser = await User.create({ full_name, email, password, phone, role: 'admin' });

    // Store in session
    req.session.user = {
      id: adminUser.id,
      full_name: adminUser.full_name,
      email: adminUser.email,
      role: 'admin'
    };

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      user: { id: adminUser.id, full_name: adminUser.full_name, email: adminUser.email, role: 'admin' },
    });
  } catch (err) {
    console.error('Create admin error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};