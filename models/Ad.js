const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Ad title is required'],
    },
    description: String,
    adUrl: {
      type: String,
      required: [true, 'Ad URL is required'],
    },
    videoUrl: String,
    imageUrl: String,
    duration: {
      type: Number,
      default: 30,
      required: true,
    },
    earning: {
      type: Number,
      default: 0.5,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'paused'],
      default: 'active',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    dailyLimit: {
      type: Number,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ad', adSchema);
