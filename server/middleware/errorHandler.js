/**
 * Centralised error handler.
 * Returns JSON for API routes, a plain status for everything else.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error.'
      : err.message;

  if (req.path.startsWith('/api/')) {
    return res.status(status).json({ error: message });
  }
  res.status(status).send(message);
}

module.exports = errorHandler;
