

exports.isAdmin = (req, res, next) => {
    if (req.session.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied (Admin only)" });
    }
    next();
};

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  next();
};