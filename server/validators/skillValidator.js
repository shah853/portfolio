const { body } = require('express-validator');

const validateSkill = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('level').trim().notEmpty().withMessage('Level is required'),
];

module.exports = { validateSkill };