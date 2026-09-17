const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const habitRoutes = require('./habitRoutes');
const completionRoutes = require('./completionRoutes');
const tipRoutes = require('./tipRoutes');
const activityRoutes = require('./activityRoutes');
const dbRoutes = require('./dbRoutes');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 timestamp: { type: string, format: date-time }
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/habits', habitRoutes);
router.use('/completions', completionRoutes);
router.use('/tips', tipRoutes);
router.use('/activity', activityRoutes);
router.use('/db', dbRoutes);

module.exports = router;
