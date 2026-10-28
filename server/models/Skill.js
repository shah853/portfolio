const mongoose = require('mongoose');
const { SKILL_LEVELS, SKILL_CATEGORIES } = require('../constants');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: Object.values(SKILL_CATEGORIES), required: true },
    level: { type: String, enum: Object.values(SKILL_LEVELS), required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
