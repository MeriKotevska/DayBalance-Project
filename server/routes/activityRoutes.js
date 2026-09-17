const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/activityController');
const validate = require('../middleware/validate');
const v = require('../middleware/validators');

/**
 * @swagger
 * /api/activity:
 *   get:
 *     summary: List all activity history records (with optional filtering)
 *     tags: [ActivityHistory]
 *     parameters:
 *       - name: user
 *         in: query
 *         schema: { type: string }
 *         description: Filter by user ID
 *       - name: targetType
 *         in: query
 *         schema: { type: string, enum: [Habit, HabitCompletion, Category, HealthyTip, User] }
 *         description: Filter by target type
 *     responses:
 *       200:
 *         description: A list of activity records (newest first)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ActivityHistory' }
 */
router.get('/', ctrl.list);

/**
 * @swagger
 * /api/activity/{id}:
 *   get:
 *     summary: Get an activity record by ID
 *     tags: [ActivityHistory]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: The activity record, $ref: '#/components/schemas/ActivityHistory' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', v.mongoIdParam(), validate, ctrl.getById);

/**
 * @swagger
 * /api/activity:
 *   post:
 *     summary: Create an activity history record
 *     tags: [ActivityHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ActivityHistoryInput' }
 *     responses:
 *       201: { description: Activity created, $ref: '#/components/schemas/ActivityHistory' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 */
router.post('/', v.activityCreateRules, validate, ctrl.create);

/**
 * @swagger
 * /api/activity/{id}:
 *   put:
 *     summary: Update an activity history record
 *     tags: [ActivityHistory]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ActivityHistoryInput' }
 *     responses:
 *       200: { description: Updated activity, $ref: '#/components/schemas/ActivityHistory' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.put('/:id', v.mongoIdParam(), v.activityUpdateRules, validate, ctrl.update);

/**
 * @swagger
 * /api/activity/{id}:
 *   delete:
 *     summary: Delete an activity history record
 *     tags: [ActivityHistory]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204: { description: Activity deleted }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:id', v.mongoIdParam(), validate, ctrl.remove);

module.exports = router;
