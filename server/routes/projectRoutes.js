const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateProject, normalizeProjectBody } = require('../validators/projectValidator');
const { handleValidationErrors } = require('../validators/authValidator');

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post(
  '/',
  protect,
  admin,
  uploadFields,
  normalizeProjectBody,
  validateProject,
  handleValidationErrors,
  createProject
);
router.put(
  '/:id',
  protect,
  admin,
  uploadFields,
  normalizeProjectBody,
  validateProject,
  handleValidationErrors,
  updateProject
);
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;
