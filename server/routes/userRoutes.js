const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const validate = require('../middleware/validate');
const v = require('../middleware/validators');
const {authenticate,adminOnly}=require('../middleware/auth');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users (password field excluded)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 */
router.get('/',authenticate,adminOnly,ctrl.list);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200: { description: The user, $ref: '#/components/schemas/User' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id',authenticate,adminOnly,v.mongoIdParam(),validate,ctrl.getById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       201: { description: User created, $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.post('/',authenticate,adminOnly,v.userCreateRules,validate,ctrl.create);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UserInput' }
 *     responses:
 *       200: { description: Updated user, $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.put('/:id',authenticate,adminOnly,v.mongoIdParam(),v.userUpdateRules,validate,ctrl.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204: { description: User deleted }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.delete('/:id',authenticate,adminOnly,v.mongoIdParam(),validate,ctrl.remove);

module.exports = router;
