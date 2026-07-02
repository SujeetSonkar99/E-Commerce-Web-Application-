const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyToken = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies['eShopAuth']) {
      token = req.cookies['eShopAuth'];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided', status: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userName: decoded.sub });
    if (!user) {
      return res.status(401).json({ message: 'User not found', status: false });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', status: false });
  }
};

const hasRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized', status: false });
  const userRoles = req.user.roles || [];
  const allowed = roles.some(r => userRoles.includes(r));
  if (!allowed) {
    return res.status(403).json({ message: 'Access denied: insufficient role', status: false });
  }
  next();
};

module.exports = { verifyToken, hasRole };
