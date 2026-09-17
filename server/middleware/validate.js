const { validationResult } = require('express-validator');

/**
 * Middleware that checks express-validator results.
 * If validation fails, returns 400 with a structured error response.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Request validation failed.',
      details: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
        value: e.value,
      })),
    });
  }
  next();
}

module.exports = validate;
