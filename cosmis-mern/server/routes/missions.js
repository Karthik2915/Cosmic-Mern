const express = require('express');
const router = express.Router();
const Mission = require('../models/Mission');
const User = require('../models/User');
const { protect } = require('./auth');

// GET /api/missions/gallery — public gallery (Tier 4)
router.get('/gallery', async (req, res) => {
  try {
    const { sort = '-createdAt', tag, limit = 20, page = 1 } = req.query;
    const filter = { isPublic: true };
    if (tag) filter.tags = tag;
    const missions = await Mission.find(filter)
      .sort(sort)
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .populate('author', 'username avatar')
      .lean();
    const total = await Mission.countDocuments(filter);
    res.json({ missions, total, pages: Math.ceil(total / +limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/missions/my — user's own missions
router.get('/my', protect, async (req, res) => {
  try {
    const missions = await Mission.find({ author: req.user._id }).sort('-updatedAt').lean();
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/missions/:id
router.get('/:id', async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(
      req.params.id, { $inc: { viewCount: 1 } }, { new: true }
    ).populate('author', 'username avatar').lean();
    if (!mission) return res.status(404).json({ error: 'Mission not found' });
    res.json(mission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions — create
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, params, components, analysis, isPublic, tags } = req.body;
    const mission = await Mission.create({
      title, description, params, components, analysis,
      isPublic: !!isPublic, tags: tags || [],
      author: req.user._id, authorName: req.user.username,
    });
    // Award XP for creating a mission
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 50 } });
    res.status(201).json(mission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/missions/:id — update
router.patch('/:id', protect, async (req, res) => {
  try {
    const mission = await Mission.findOne({ _id: req.params.id, author: req.user._id });
    if (!mission) return res.status(404).json({ error: 'Not found or unauthorized' });
    Object.assign(mission, req.body);
    await mission.save();
    res.json(mission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/missions/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const mission = await Mission.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!mission) return res.status(404).json({ error: 'Not found or unauthorized' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/fork — fork a public mission (Tier 4)
router.post('/:id/fork', protect, async (req, res) => {
  try {
    const source = await Mission.findById(req.params.id);
    if (!source || !source.isPublic) return res.status(404).json({ error: 'Mission not found or private' });
    const fork = await Mission.create({
      title: `${source.title} (Fork)`,
      description: source.description,
      params: source.params, components: source.components,
      author: req.user._id, authorName: req.user.username,
      isPublic: false, forkedFrom: source._id, tags: source.tags,
    });
    await Mission.findByIdAndUpdate(source._id, { $inc: { forkCount: 1 } });
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 20 } });
    res.status(201).json(fork);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/rate — rate a mission (Tier 4)
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { score } = req.body;
    if (!score || score < 1 || score > 5) return res.status(400).json({ error: 'Score must be 1–5' });
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ error: 'Not found' });
    const existing = mission.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existing) { existing.score = score; }
    else { mission.ratings.push({ user: req.user._id, score }); }
    await mission.save();
    res.json({ avgRating: mission.avgRating, ratingCount: mission.ratingCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/missions/:id/snapshot — save version (Tier 2)
router.post('/:id/snapshot', protect, async (req, res) => {
  try {
    const { label } = req.body;
    const mission = await Mission.findOne({ _id: req.params.id, author: req.user._id });
    if (!mission) return res.status(404).json({ error: 'Not found' });
    mission.snapshots.push({ label: label || `v${mission.snapshots.length + 1}`, params: mission.params, components: mission.components });
    if (mission.snapshots.length > 20) mission.snapshots.shift(); // keep last 20
    await mission.save();
    res.json(mission.snapshots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
