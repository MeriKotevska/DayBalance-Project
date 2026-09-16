const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Habit name is required.'],
      trim: true,
      minlength: [2, 'Habit name must be at least 2 characters.'],
      maxlength: [100, 'Habit name cannot exceed 100 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required.'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner (user) reference is required.'],
    },
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime'],
      default: 'anytime',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'weekdays', 'weekends', 'custom'],
      default: 'daily',
    },
    duration: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute.'],
      max: [480, 'Duration cannot exceed 480 minutes (8 hours).'],
      default: 10,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    reminder: {
      type: String,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Reminder must be in HH:MM format.'],
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
