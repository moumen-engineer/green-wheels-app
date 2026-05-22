function requireAuth(req, res, next) {
  if (!req.session || req.session.user == null) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  next();
}

module.exports = requireAuth;
