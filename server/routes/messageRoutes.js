const express = require('express');
const router = express.Router();
const {
  getMessages,
  getMessageById,
  createMessage,
  markAsRead,
  markAsUnread,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { limitPublicMessageSubmissions } = require('../middleware/messageRateLimit');
const { validateMessage } = require('../validators/messageValidator');
const { handleValidationErrors } = require('../validators/authValidator');

router.post('/', limitPublicMessageSubmissions, validateMessage, handleValidationErrors, createMessage);
router.get('/', protect, admin, getMessages);
router.get('/:id', protect, admin, getMessageById);
router.patch('/:id/read', protect, admin, markAsRead);
router.patch('/:id/unread', protect, admin, markAsUnread);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
