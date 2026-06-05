const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true, minlength: 6 },
  avatar:      { type: String, default: '' },
  bio:         { type: String, default: '', maxlength: 300 },

  // Tier 4 — User Profiles
  savedMissions:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }],
  collections:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }],
  badges: [{
    id:       String,
    label:    String,
    icon:     String,
    earnedAt: { type: Date, default: Date.now },
  }],
  xp:           { type: Number, default: 0 },
  level:        { type: Number, default: 1 },
  searchHistory: [{
    query:     String,
    result:    mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
    bookmarked: { type: Boolean, default: false },
  }],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
