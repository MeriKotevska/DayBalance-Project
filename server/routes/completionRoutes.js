const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/completionController');
const validate = require('../middleware/validate');
const v = require('../middleware/validators');
const {authenticate}=require('../middleware/auth');

/**
 * @swagger
 * /api/completions:
 *   get:
 *     summary: List all habit completions (with optional filtering)
 *     tags: [HabitCompletions]
 *     parameters:
 *       - name: habit
 *         in: query
 *         schema: { type: string }
 *         description: Filter by habit ID
 *       - name: user
 *         in: query
 *         schema: { type: string }
 *         description: Filter by user ID
 *       - name: completed
 *         in: query
 *         schema: { type: string, enum: ['true', 'false'] }
 *         description: Filter by completion status
 *     responses:
 *       200:
 *         description: A list of habit completions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/HabitCompletion' }
 */
router.get('/', authenticate, ctrl.list);

/**
 * @swagger
 * /api/completions/{id}:
 *   get:
 *     summary: Get a habit completion by ID
 *     tags: [HabitCompletions]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: The completion record, $ref: '#/components/schemas/HabitCompletion' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', authenticate, v.mongoIdParam(), validate, ctrl.getById);

/**
 * @swagger
 * /api/completions:
 *   post:
 *     summary: Create a habit completion record
 *     tags: [HabitCompletions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HabitCompletionInput' }
 *     responses:
 *       201: { description: Completion created, $ref: '#/components/schemas/HabitCompletion' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post('/', authenticate, v.completionCreateRules, validate, ctrl.create);

/**
 * @swagger
 * /api/completions/{id}:
 *   put:
 *     summary: Update a habit completion record
 *     tags: [HabitCompletions]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HabitCompletionInput' }
 *     responses:
 *       200: { description: Updated completion, $ref: '#/components/schemas/HabitCompletion' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.put('/:id', authenticate, v.mongoIdParam(), v.completionUpdateRules, validate, ctrl.update);

/**
 * @swagger
 * /api/completions/{id}:
 *   delete:
 *     summary: Delete a habit completion record
 *     tags: [HabitCompletions]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204: { description: Completion deleted }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:id', authenticate, v.mongoIdParam(), validate, ctrl.remove);

module.exports = router;
