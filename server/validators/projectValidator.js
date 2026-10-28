const { body } = require('express-validator');

const normalizeProjectBody = (req, res, next) => {
  if (typeof req.body.stack === 'string') {
    try {
      const parsedStack = JSON.parse(req.body.stack);
      req.body.stack = Array.isArray(parsedStack)
        ? parsedStack
        : req.body.stack.split(',').map((item) => item.trim()).filter(Boolean);
    } catch (error) {
      req.body.stack = req.body.stack.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }

  if (req.body.featured === 'true') req.body.featured = true;
  else if (req.body.featured === 'false') req.body.featured = false;

  next();
};

const validateProject = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('stack').isArray({ min: 1 }).withMessage('Stack must have at least one item'),
];

module.exports = { validateProject, normalizeProjectBody };
