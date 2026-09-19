const { body, param, query } = require('express-validator');

/**
 * Reusable validation rule chains for POST/PUT bodies.
 */

const mongoIdParam = (field = 'id') =>
  param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId.`);

const optionalMongoIdBody = (field) =>
  body(field)
    .optional()
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId.`);

const requiredMongoIdBody = (field) =>
  body(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId.`);

// ── User ──
const userCreateRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be "user" or "admin".'),
];

const userUpdateRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters.'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be "user" or "admin".'),
];

// ── Category ──
const categoryCreateRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be 2-50 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters.'),
];

const categoryUpdateRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be 2-50 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters.'),
];

// ── Habit ──
const habitCreateRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Habit name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Habit name must be 2-100 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters.'),
  requiredMongoIdBody('category'),
  body('timeOfDay')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'anytime'])
    .withMessage('timeOfDay must be morning, afternoon, evening, or anytime.'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'weekdays', 'weekends', 'custom'])
    .withMessage('frequency must be daily, weekly, weekdays, weekends, or custom.'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes.'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard.'),
  body('reminder')
    .optional({ nullable: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Reminder must be in HH:MM format.'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean.'),
];

const habitUpdateRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Habit name must be 2-100 characters.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters.'),
  optionalMongoIdBody('category'),
  optionalMongoIdBody('owner'),
  body('timeOfDay')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'anytime'])
    .withMessage('timeOfDay must be morning, afternoon, evening, or anytime.'),
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'weekdays', 'weekends', 'custom'])
    .withMessage('frequency must be daily, weekly, weekdays, weekends, or custom.'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes.'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard.'),
  body('reminder')
    .optional({ nullable: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Reminder must be in HH:MM format.'),
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean.'),
];

// ── HabitCompletion ──
const completionCreateRules = [
  requiredMongoIdBody('habit'),
  optionalMongoIdBody('user'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date.'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean.'),
];

const completionUpdateRules = [
  optionalMongoIdBody('habit'),
  optionalMongoIdBody('user'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date.'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean.'),
];

// ── HealthyTip ──
const tipCreateRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Tip title is required.')
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be 3-120 characters.'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Tip content is required.')
    .isLength({ max: 2000 })
    .withMessage('Content cannot exceed 2000 characters.'),
  requiredMongoIdBody('category'),
];

const tipUpdateRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('Title must be 3-120 characters.'),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Content cannot exceed 2000 characters.'),
  optionalMongoIdBody('category'),
];

// ── ActivityHistory ──
const activityCreateRules = [
  requiredMongoIdBody('user'),
  body('action')
    .trim()
    .notEmpty()
    .withMessage('Action is required.')
    .isLength({ max: 100 })
    .withMessage('Action cannot exceed 100 characters.'),
  body('targetType')
    .isIn(['Habit', 'HabitCompletion', 'Category', 'HealthyTip', 'User'])
    .withMessage('targetType must be Habit, HabitCompletion, Category, HealthyTip, or User.'),
  requiredMongoIdBody('targetId'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date.'),
];

const activityUpdateRules = [
  optionalMongoIdBody('user'),
  body('action')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Action cannot exceed 100 characters.'),
  body('targetType')
    .optional()
    .isIn(['Habit', 'HabitCompletion', 'Category', 'HealthyTip', 'User'])
    .withMessage('targetType must be Habit, HabitCompletion, Category, HealthyTip, or User.'),
  optionalMongoIdBody('targetId'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date.'),
];

module.exports = {
  mongoIdParam,
  userCreateRules,
  userUpdateRules,
  categoryCreateRules,
  categoryUpdateRules,
  habitCreateRules,
  habitUpdateRules,
  completionCreateRules,
  completionUpdateRules,
  tipCreateRules,
  tipUpdateRules,
  activityCreateRules,
  activityUpdateRules,
};
