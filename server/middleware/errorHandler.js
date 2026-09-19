/**
 * Centralised error handler.
 * Returns consistent JSON for API routes, a plain status for everything else.
 *
 * JSON shape:
 * { error: "...", message: "...", details: [...] }
 */
function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error.';
  let details = err.details || undefined;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation failed.';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key (E11000)
  if (err.code === 11000 || err.codeName === 'DuplicateKey') {
    status = 409;
    message = 'A resource with this value already exists.';
    details = err.keyValue
      ? Object.entries(err.keyValue).map(([field, value]) => ({
          field,
          value,
          message: `${field} "${value}" is already in use.`,
        }))
      : undefined;
  }

  // Cast error (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Don't expose stack traces in production for 500s
  if (status === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error.';
  }

  if ((req.originalUrl || req.path).startsWith('/api/')) {
    const body = { error: err.name || 'Error', message };
    if (details) body.details = details;
    return res.status(status).json(body);
  }

  res.status(status).send(message);
}

module.exports = errorHandler;
