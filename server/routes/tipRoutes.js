const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tipController');
const validate = require('../middleware/validate');
const v = require('../middleware/validators');
const {authenticate,adminOnly}=require('../middleware/auth');

/**
 * @swagger
 * /api/tips:
 *   get:
 *     summary: List all healthy tips (with optional filtering)
 *     tags: [HealthyTips]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema: { type: string }
 *         description: Search tip titles and content (case-insensitive)
 *       - name: category
 *         in: query
 *         schema: { type: string }
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: A list of healthy tips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/HealthyTip' }
 */
router.get('/', ctrl.list);

/**
 * @swagger
 * /api/tips/{id}:
 *   get:
 *     summary: Get a healthy tip by ID
 *     tags: [HealthyTips]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: The healthy tip, $ref: '#/components/schemas/HealthyTip' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', v.mongoIdParam(), validate, ctrl.getById);

/**
 * @swagger
 * /api/tips:
 *   post:
 *     summary: Create a new healthy tip
 *     tags: [HealthyTips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HealthyTipInput' }
 *     responses:
 *       201: { description: Tip created, $ref: '#/components/schemas/HealthyTip' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 */
router.post('/',authenticate,adminOnly,v.tipCreateRules,validate,ctrl.create);

/**
 * @swagger
 * /api/tips/{id}:
 *   put:
 *     summary: Update a healthy tip
 *     tags: [HealthyTips]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HealthyTipInput' }
 *     responses:
 *       200: { description: Updated tip, $ref: '#/components/schemas/HealthyTip' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.put('/:id',authenticate,adminOnly,v.mongoIdParam(),v.tipUpdateRules,validate,ctrl.update);

/**
 * @swagger
 * /api/tips/{id}:
 *   delete:
 *     summary: Delete a healthy tip
 *     tags: [HealthyTips]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204: { description: Tip deleted }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:id',authenticate,adminOnly,v.mongoIdParam(),validate,ctrl.remove);

module.exports = router;
