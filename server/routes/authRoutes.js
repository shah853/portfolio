const express = require('express');
const router = express.Router();
const { loginUser, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateLogin,
  validateChangePassword,
  handleValidationErrors,
} = require('../validators/authValidator');

router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.get('/me', protect, getMe);
router.patch('/change-password', protect, validateChangePassword, handleValidationErrors, changePassword);

module.exports = router;
