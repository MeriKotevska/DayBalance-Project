const express=require('express');const {body}=require('express-validator');const validate=require('../middleware/validate');const c=require('../controllers/authController');const {authenticate}=require('../middleware/auth');const r=express.Router();
/** @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a user
 *     requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthRegister'}}}}
 *     responses: {201: {description: Registered}, 400: {$ref: '#/components/responses/ValidationError'}, 409: {$ref: '#/components/responses/Conflict'}}
 */
r.post('/register',[body('name').trim().isLength({min:2,max:50}),body('email').isEmail().normalizeEmail(),body('password').isLength({min:6})],validate,c.register);
/** @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login and receive JWT
 *     requestBody: {required: true, content: {application/json: {schema: {$ref: '#/components/schemas/AuthLogin'}}}}
 *     responses: {200: {description: Logged in}, 401: {description: Invalid credentials}}
 */
r.post('/login',[body('email').isEmail().normalizeEmail(),body('password').notEmpty()],validate,c.login);
/** @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Current authenticated user
 *     security: [{bearerAuth: []}]
 *     responses: {200: {description: Current user}, 401: {description: Unauthorized}}
 */
r.get('/me',authenticate,c.me);module.exports=r;