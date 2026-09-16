/**
 * Central export point for all Mongoose models.
 */
const User = require('./User');
const Category = require('./Category');
const Habit = require('./Habit');
const HabitCompletion = require('./HabitCompletion');
const HealthyTip = require('./HealthyTip');
const ActivityHistory = require('./ActivityHistory');

module.exports = {
  User,
  Category,
  Habit,
  HabitCompletion,
  HealthyTip,
  ActivityHistory,
};
