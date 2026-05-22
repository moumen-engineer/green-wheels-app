// Simple validation middleware (no external lib)

const validateRegister = (req, res, next) => {
  const { full_name, email, password, phone } = req.body;
  const errors = [];

  if (!full_name || full_name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email is required.');
  }

  if (!phone || !/^\d{10}$/.test(phone)) {
    errors.push('Phone number must be exactly 10 digits.');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email is required.');
  }

  if (!password) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, errors: ['A valid email is required.'] });
  }

  next();
};

const validateResetPassword = (req, res, next) => {
  const { token, password } = req.body;
  const errors = [];

  if (!token) {
    errors.push('Reset token is required.');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
