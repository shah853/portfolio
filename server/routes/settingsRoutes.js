const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getSettings);
router.put(
  '/',
  protect,
  admin,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;
