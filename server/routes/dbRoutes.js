const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dbController');

/**
 * @swagger
 * /api/db/reset:
 *   post:
 *     summary: Delete all data from DayBalance collections
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: All collections cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 */
router.post('/reset', ctrl.reset);

/**
 * @swagger
 * /api/db/seed:
 *   post:
 *     summary: Seed the database with realistic DayBalance sample data
 *     tags: [Database]
 *     responses:
 *       201:
 *         description: Database seeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 counts: { type: object }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post('/seed', ctrl.seed);

/**
 * @swagger
 * /api/db/reset-and-seed:
 *   post:
 *     summary: Reset all data then seed fresh sample data
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Database reset and seeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 seed: { type: object }
 */
router.post('/reset-and-seed', ctrl.resetAndSeed);

module.exports = router;
