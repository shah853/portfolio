const { body } = require('express-validator');

const validateMessage = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ max: 120 })
    .withMessage('Name must be 120 characters or fewer'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .bail()
    .isLength({ max: 254 })
    .withMessage('Email must be 254 characters or fewer'),
  body('subject')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must be 200 characters or fewer'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .bail()
    .isLength({ max: 5000 })
    .withMessage('Message must be 5000 characters or fewer'),
];

module.exports = { validateMessage };