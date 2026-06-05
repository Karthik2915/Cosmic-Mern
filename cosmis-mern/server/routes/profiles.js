const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mission = require('../models/Mission');

// GET /api/profiles/:username — public profile page
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email -searchHistory')
      .lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    const missions = await Mission.find({ author: user._id, isPublic: true })
      .sort('-createdAt').limit(10).lean();
    res.json({ ...user, missions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
