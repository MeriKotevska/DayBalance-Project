const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/habitController');
const validate = require('../middleware/validate');
const v = require('../middleware/validators');

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: List all habits (with optional filtering)
 *     tags: [Habits]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema: { type: string }
 *         description: Search habit names (case-insensitive)
 *       - name: category
 *         in: query
 *         schema: { type: string }
 *         description: Filter by category ID
 *       - name: timeOfDay
 *         in: query
 *         schema: { type: string, enum: [morning, afternoon, evening, anytime] }
 *         description: Filter by time of day
 *       - name: owner
 *         in: query
 *         schema: { type: string }
 *         description: Filter by owner (user) ID
 *     responses:
 *       200:
 *         description: A list of habits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Habit' }
 */
router.get('/', ctrl.list);

/**
 * @swagger
 * /api/habits/{id}:
 *   get:
 *     summary: Get a habit by ID
 *     tags: [Habits]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: The habit, $ref: '#/components/schemas/Habit' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', v.mongoIdParam(), validate, ctrl.getById);

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HabitInput' }
 *     responses:
 *       201: { description: Habit created, $ref: '#/components/schemas/Habit' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 */
router.post('/', v.habitCreateRules, validate, ctrl.create);

/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Update a habit
 *     tags: [Habits]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HabitInput' }
 *     responses:
 *       200: { description: Updated habit, $ref: '#/components/schemas/Habit' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.put('/:id', v.mongoIdParam(), v.habitUpdateRules, validate, ctrl.update);

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Delete a habit
 *     tags: [Habits]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204: { description: Habit deleted }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:id', v.mongoIdParam(), validate, ctrl.remove);

module.exports = router;
