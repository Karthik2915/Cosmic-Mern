// history.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('./auth');

// GET /api/history
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('searchHistory');
    res.json(user.searchHistory.reverse());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/history — add entry
router.post('/', protect, async (req, res) => {
  try {
    const { query, result } = req.body;
    const user = await User.findById(req.user._id);
    user.searchHistory.push({ query, result });
    if (user.searchHistory.length > 100) user.searchHistory.shift();
    user.xp = (user.xp || 0) + 5;
    await user.save();
    res.status(201).json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/history/:idx/bookmark
router.patch('/:idx/bookmark', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const item = user.searchHistory[req.params.idx];
    if (!item) return res.status(404).json({ error: 'Not found' });
    item.bookmarked = !item.bookmarked;
    await user.save();
    res.json({ bookmarked: item.bookmarked });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/history — clear all
router.delete('/', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { searchHistory: [] });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
