const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    earningsPerAd: {
      type: Number,
      default: 0.5,
      required: true,
      min: 0,
    },
    minimumWithdrawal: {
      type: Number,
      default: 100,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: '₹',
    },
    maxAdsPerDay: {
      type: Number,
      default: 50,
    },
    updatedBy: {
      type: String,
      default: 'admin',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
