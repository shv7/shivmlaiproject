// models/User.js
// ─────────────────────────────────────────────
// User Schema — defines how users are stored in MongoDB
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  // ─── BASIC INFO ───────────────────────────
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Never return password in queries by default
  },

  // ─── ROLE ─────────────────────────────────
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },

  // ─── PROGRESS ─────────────────────────────
  // Tracks which lessons the user has completed
  progress: {
    Level1_AIFundamentals:    { type: Number, default: 0 },
    Level2_MathForAI:         { type: Number, default: 0 },
    Level3_MachineLearning:   { type: Number, default: 0 },
    Level4_DeepLearning:      { type: Number, default: 0 },
    Level5_ModernAISystems:   { type: Number, default: 0 },
    Level6_AgenticAI:         { type: Number, default: 0 },
    Level7_AGI:               { type: Number, default: 0 }
  },

  // ─── COMPLETED LESSONS ────────────────────
  completedLessons: {
    type: [String],
    default: []
  },

  // ─── UNLOCKED LEVELS ──────────────────────
  unlockedLevels: {
    type: [String],
    default: ['Level1_AIFundamentals']  // Level 1 always unlocked
  },

  // ─── TOKENS (for early unlock) ────────────
  tokens: {
    type: Number,
    default: 0
  },

  // ─── CERTIFICATES ─────────────────────────
  certificates: {
    type: [String],
    default: []
  },

  // ─── TIMESTAMPS ───────────────────────────
  createdAt: {
    type: Date,
    default: Date.now
  },

  lastLogin: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('User', UserSchema);