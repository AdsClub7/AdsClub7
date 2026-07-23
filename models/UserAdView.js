const mongoose = require('mongoose');

const userAdViewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ad',
      required: true,
    },
    earnedAmount: {
      type: Number,
      required: true,
    },
    watchedDuration: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for user and date queries
userAdViewSchema.index({ userId: 1, viewedAt: -1 });
userAdViewSchema.index({ adId: 1 });

module.exports = mongoose.model('UserAdView', userAdViewSchema);
