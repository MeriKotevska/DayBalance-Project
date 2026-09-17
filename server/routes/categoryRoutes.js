const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const validate = require('../middleware/validate');
const v = require('../middleware/validators');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Category' }
 */
router.get('/', ctrl.list);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: The category, $ref: '#/components/schemas/Category' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', v.mongoIdParam(), validate, ctrl.getById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       201: { description: Category created, $ref: '#/components/schemas/Category' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post('/', v.categoryCreateRules, validate, ctrl.create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryInput' }
 *     responses:
 *       200: { description: Updated category, $ref: '#/components/schemas/Category' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.put('/:id', v.mongoIdParam(), v.categoryUpdateRules, validate, ctrl.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204: { description: Category deleted }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:id', v.mongoIdParam(), validate, ctrl.remove);

module.exports = router;
