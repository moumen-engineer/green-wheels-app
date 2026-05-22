// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    const status = err.status || err.statusCode || 500;
    const message =
      status === 500 && process.env.NODE_ENV === 'production'
        ? 'Server error.'
        : err.message || 'Server error.';
  
    if (status >= 500) {
      console.error(err);
    }
  
    res.status(status).json({
      success: false,
      message,
    });
  }
  
  module.exports = errorHandler;
