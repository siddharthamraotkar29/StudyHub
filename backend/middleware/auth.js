const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DISABLE_AUTH = (process.env.DISABLE_AUTH === 'true');

const auth = async (req, res, next) => {
  try {
    if (DISABLE_AUTH) {
      // Bypass authentication entirely and inject a dummy user for dev/testing.
      // NOTE: This is insecure and should NOT be used in production.
      req.user = {
        id: 'dev-user',
        name: 'Dev User',
        email: 'dev@example.com',
        role: 'dev'
      };
      return next();
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: 'JWT_SECRET not configured on server'
      });
    }

    const decoded = jwt.verify(token, secret);
    // If you store user id in token payload as `id`
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    // Try to fetch user from DB if available (best-effort)
    try {
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      } else {
        // token valid but user not found — set minimal info
        req.user = { id: decoded.id };
      }
    } catch (err) {
      // If DB lookup fails, still proceed with decoded id to allow token-based flow
      req.user = { id: decoded.id };
    }

    next();
  } catch (err) {
    console.error('Auth error:', err.message || err);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = auth;
