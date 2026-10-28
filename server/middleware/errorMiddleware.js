const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const isCastError = err.name === 'CastError';
  const statusCode = isCastError ? 404 : (res.statusCode === 200 ? 500 : res.statusCode);
  const message = isCastError ? 'Resource not found' : err.message;

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
