const express = require('express');

const router = express.Router();

/**
 * API routes placeholder.
 *
 * REST CRUD endpoints (users, habits, categories, completions, tips,
 * activity) will be mounted here in a later part. For Part 2 we expose
 * a single health-check endpoint so the API layer is wired and testable.
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
