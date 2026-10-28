const express = require('express');
const router = express.Router();
const {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateCertificate } = require('../validators/certificateValidator');
const { handleValidationErrors } = require('../validators/authValidator');

router.get('/', getCertificates);
router.get('/:id', getCertificateById);
router.post('/', protect, admin, upload.single('file'), validateCertificate, handleValidationErrors, createCertificate);
router.put('/:id', protect, admin, upload.single('file'), validateCertificate, handleValidationErrors, updateCertificate);
router.delete('/:id', protect, admin, deleteCertificate);

module.exports = router;