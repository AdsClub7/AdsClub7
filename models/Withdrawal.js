const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
    },
    rejectionReason: String,
    requestDate: {
      type: Date,
      default: Date.now,
    },
    processedDate: Date,
    processedBy: String,
    transactionId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
