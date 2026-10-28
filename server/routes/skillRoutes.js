const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { validateSkill } = require('../validators/skillValidator');
const { handleValidationErrors } = require('../validators/authValidator');

router.get('/', getSkills);
router.get('/:id', getSkillById);
router.post('/', protect, admin, validateSkill, handleValidationErrors, createSkill);
router.put('/:id', protect, admin, validateSkill, handleValidationErrors, updateSkill);
router.delete('/:id', protect, admin, deleteSkill);

module.exports = router;