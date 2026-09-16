const mongoose = require('mongoose');

const activityHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
    },
    action: {
      type: String,
      required: [true, 'Action is required.'],
      trim: true,
      maxlength: [100, 'Action cannot exceed 100 characters.'],
    },
    targetType: {
      type: String,
      enum: ['Habit', 'HabitCompletion', 'Category', 'HealthyTip', 'User'],
      required: [true, 'Target type is required.'],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target ID is required.'],
    },
    date: {
      type: Date,
      required: [true, 'Activity date is required.'],
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityHistory', activityHistorySchema);
