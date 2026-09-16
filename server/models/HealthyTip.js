const mongoose = require('mongoose');

const healthyTipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tip title is required.'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters.'],
      maxlength: [120, 'Title cannot exceed 120 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Tip content is required.'],
      trim: true,
      maxlength: [2000, 'Content cannot exceed 2000 characters.'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required.'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthyTip', healthyTipSchema);
