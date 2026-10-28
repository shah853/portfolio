const { body } = require('express-validator');

const validateCertificate = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('issuer').optional({ values: 'falsy' }).trim(),
  body('date').optional({ values: 'falsy' }).isISO8601().withMessage('Date must be valid'),
];

module.exports = { validateCertificate };