// ===============================
// StudyHub Backend - middleware/auth.js
// ===============================

// This version disables all authentication checks.
// It allows every request to proceed as if the user is authenticated.
// Safe for quick testing and Render deployments — NOT for production.

module.exports = async (req, res, next) => {
  try {
    // Dummy user object (so routes expecting req.user don’t break)
    req.user = {
      id: 'open-access-user',
      name: 'Open User',
      email: 'open@studyhub.dev',
      role: 'developer'
    };

    // Skip all checks, just continue
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message || error);
    next();
  }
};
