// ===============================
// StudyHub Backend - server.js
// ===============================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// -------------------------------
// Environment setup
// -------------------------------
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// -------------------------------
// Express app initialization
// -------------------------------
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------
// CORS configuration (fully open)
// -------------------------------
app.use(cors());
console.log('🌍 CORS: Fully open to all origins');

// -------------------------------
// MongoDB connection
// -------------------------------
if (!MONGODB_URI) {
  console.warn('⚠️  No MongoDB URI found in environment!');
} else {
  mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));
}

// -------------------------------
// Dummy Auth Middleware (optional, always allows)
// -------------------------------
const authMiddleware = (req, res, next) => {
  req.user = { id: 'demo', name: 'Render User' };
  next();
};

// -------------------------------
// Routes
// -------------------------------
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 StudyHub Backend running on Render!',
    environment: NODE_ENV,
  });
});

app.get('/api/public', (req, res) => {
  res.json({
    success: true,
    message: 'This is a public route (no authentication)',
  });
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route — authentication bypassed for testing',
    user: req.user,
  });
});

// -------------------------------
// Start Server
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${NODE_ENV})`);
});
