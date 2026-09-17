const mongoose = require('mongoose');

const habitCompletionSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: [true, 'Habit reference is required.'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
    },
    date: {
      type: Date,
      required: [true, 'Completion date is required.'],
      default: Date.now,
    },
    dayKey: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'dayKey must be in YYYY-MM-DD format.'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One completion record per habit per user per calendar day.
habitCompletionSchema.index(
  { user: 1, habit: 1, dayKey: 1 },
  { unique: true }
);

/**
 * Normalise a Date or date string into a YYYY-MM-DD dayKey.
 */
habitCompletionSchema.statics.normalizeDayKey = function (date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

module.exports = mongoose.model('HabitCompletion', habitCompletionSchema);
