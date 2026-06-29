const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';

module.exports = async function (req, res, next) {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ fetch actual user from DB so req.user._id exists
    req.user = await User.findById(decoded.id || decoded.userId).select('-password');

    if (!req.user) return res.status(401).json({ message: 'User not found' });

    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};