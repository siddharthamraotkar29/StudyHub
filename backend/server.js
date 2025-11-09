// ===============================
// StudyHub Backend - server.js
// ===============================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// -------------------------------
// Environment setup
// -------------------------------
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;

const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true';
const MONGODB_URI = process.env.MONGODB_URI || null;
const JWT_SECRET = process.env.JWT_SECRET || null;

// -------------------------------
// Express app initialization
// -------------------------------
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------
// CORS configuration (completely open)
// -------------------------------
app.use(cors()); // Allow all origins, all methods, all headers
console.log('🌍 CORS: Fully open to all origins');

// -------------------------------
// Database connection
// -------------------------------
if (!MONGODB_URI) {
  console.warn('⚠️  Warning: No MONGODB_URI found in environment. MongoDB features will not work.');
} else {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));
}

// -------------------------------
// Middleware imports
// -------------------------------
const authMiddleware = require('./middleware/auth');

// If DISABLE_AUTH is enabled, skip authentication middleware globally
if (DISABLE_AUTH) {
  console.warn('⚠️  Authentication is DISABLED (DISABLE_AUTH=true)');
} else if (!JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not provided! Auth may fail.');
}

// -------------------------------
// Routes
// -------------------------------
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to StudyHub Backend API',
    mode: NODE_ENV,
    authDisabled: DISABLE_AUTH,
    corsOpen: true,
  });
});

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: req.user,
  });
});

// Example public route
app.get('/api/public', (req, res) => {
  res.json({
    success: true,
    message: 'This is a public route (no authentication needed)',
  });
});

// -------------------------------
// Global error handler
// -------------------------------
app.use((err, req, res, next) => {
  console.error('Error:', err.message || err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

// -------------------------------
// Server start
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${NODE_ENV}]`);
  if (DISABLE_AUTH) console.log('🔓 Auth is disabled (development mode)');
  console.log('🌐 CORS is open to all origins');
});
