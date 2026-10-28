const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    role: { type: String, default: '' },
    shortIntro: { type: String, default: '' },
    aboutDescription: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
