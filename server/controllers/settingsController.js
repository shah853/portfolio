const SiteSettings = require('../models/SiteSettings');

const textFields = [
  'fullName',
  'role',
  'shortIntro',
  'aboutDescription',
  'profileImage',
  'email',
  'phone',
  'location',
  'github',
  'linkedin',
  'resumeUrl',
];

const getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    return res.status(200).json(
      settings ||
        Object.fromEntries(textFields.map((field) => [field, '']))
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings();
    }

    textFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    const profileImagePath = req.files?.profileImage?.[0]?.path;
    const resumePath = req.files?.resume?.[0]?.path;
    if (profileImagePath) settings.profileImage = profileImagePath;
    if (resumePath) settings.resumeUrl = resumePath;

    await settings.save();
    return res.status(200).json(settings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
