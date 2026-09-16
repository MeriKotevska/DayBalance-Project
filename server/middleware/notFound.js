/**
 * 404 handler — returns JSON for API routes, falls through to the
 * static file server for non-existent HTML pages.
 */
function notFound(req, res, next) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Resource not found.' });
  }
  next();
}

module.exports = notFound;
