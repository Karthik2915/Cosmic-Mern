const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: '', maxlength: 500 },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName:  { type: String },

  // Mission parameters
  params: {
    type:      { type: String, default: 'LEO Satellite' },
    launcher:  { type: String, default: 'falcon9' },
    mass:      { type: Number, default: 1000 },
    alt:       { type: Number, default: 400 },
    dur:       { type: Number, default: 2 },
    power:     { type: String, default: 'solar_panels' },
    prop:      { type: String, default: 'chemical' },
    shield:    { type: String, default: 'standard' },
    incl:      { type: Number, default: 28.5 },
  },

  // 3D component list
  components: [{ type: String }],

  // Analysis result snapshot
  analysis: { type: mongoose.Schema.Types.Mixed, default: null },

  // Tier 4 — Mission Gallery
  isPublic:    { type: Boolean, default: false },
  tags:        [String],
  forkedFrom:  { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', default: null },
  forkCount:   { type: Number, default: 0 },

  // Ratings
  ratings: [{
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score:  { type: Number, min: 1, max: 5 },
  }],
  avgRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },

  // Version control snapshots (Tier 2)
  snapshots: [{
    label:      String,
    params:     mongoose.Schema.Types.Mixed,
    components: [String],
    savedAt:    { type: Date, default: Date.now },
  }],

  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

// Recompute avgRating on save
missionSchema.pre('save', function (next) {
  if (this.ratings.length) {
    this.avgRating = this.ratings.reduce((s, r) => s + r.score, 0) / this.ratings.length;
    this.ratingCount = this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Mission', missionSchema);
