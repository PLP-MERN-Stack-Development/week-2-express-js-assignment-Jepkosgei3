const { CustomError } = require('../utils/errors');

module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        type: err.name
      }
    });
  }

  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      type: 'InternalServerError'
    }
  });
};