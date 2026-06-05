const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Rate limiter for AI proxy endpoint
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, message: { error: 'Too many AI requests, slow down.' } });

// ── Routes ────────────────────────────────────────────────────
app.use('/api/ai',        aiLimiter, require('./routes/ai'));
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/missions',  require('./routes/missions'));
app.use('/api/history',   require('./routes/history'));
app.use('/api/gallery',   require('./routes/gallery'));
app.use('/api/profiles',  require('./routes/profiles'));
app.use('/api/space-weather', require('./routes/spaceWeather'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'NOMINAL', time: new Date().toISOString() }));

// ── MongoDB ───────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cosmis_v3')
  .then(() => console.log('🛸 MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 COSMIS server running on port ${PORT}`));
