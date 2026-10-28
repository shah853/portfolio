const { ROLES } = require('../constants');

const admin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    return next();
  }

  return res.status(403).json({ message: 'Not authorized as admin' });
};

module.exports = { admin };
