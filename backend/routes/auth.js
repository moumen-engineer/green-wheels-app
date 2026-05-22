const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require('../middleware/validation');

router.post('/register', validateRegister, auth.register);
router.post('/login', validateLogin, auth.login);
router.post('/logout', auth.logout);
router.get('/me', requireAuth, auth.getMe);
router.post('/forgot-password', validateForgotPassword, auth.forgotPassword);
router.post('/reset-password', validateResetPassword, auth.resetPassword);
router.post('/create-admin', validateRegister, auth.createAdmin);

module.exports = router;
