const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/auth');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Settings = require('../models/Settings');

// Request Withdrawal (User)
router.post('/request', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const settings = await Settings.findOne();
    const minimumWithdrawal = settings?.minimumWithdrawal || 100;

    if (amount < minimumWithdrawal) {
      return res.status(400).json({
        message: `Minimum withdrawal amount is ₹${minimumWithdrawal}`,
        minimumWithdrawal,
      });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const withdrawal = new Withdrawal({
      userId: req.userId,
      amount,
      bankDetails: user.bankDetails,
    });

    await withdrawal.save();

    res.status(201).json({
      message: 'Withdrawal request submitted',
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting withdrawal', error: error.message });
  }
});

// Get User's Withdrawal History
router.get('/history', protect, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.userId })
      .sort({ requestDate: -1 })
      .limit(50);

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching withdrawal history', error: error.message });
  }
});

// Get All Withdrawal Requests (Admin)
router.get('/admin/all', adminProtect, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const withdrawals = await Withdrawal.find()
      .populate('userId', 'mobileNumber balance')
      .sort({ requestDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Withdrawal.countDocuments();

    res.json({
      withdrawals,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching withdrawals', error: error.message });
  }
});

// Approve Withdrawal (Admin)
router.put('/admin/approve/:id', adminProtect, async (req, res) => {
  try {
    const { transactionId } = req.body;
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        processedDate: new Date(),
        processedBy: req.adminId,
        transactionId,
      },
      { new: true }
    );

    // Deduct from user balance
    await User.findByIdAndUpdate(withdrawal.userId, {
      $inc: {
        balance: -withdrawal.amount,
        withdrawals: withdrawal.amount,
      },
    });

    res.json({
      message: 'Withdrawal approved',
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving withdrawal', error: error.message });
  }
});

// Reject Withdrawal (Admin)
router.put('/admin/reject/:id', adminProtect, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        processedDate: new Date(),
        processedBy: req.adminId,
        rejectionReason,
      },
      { new: true }
    );

    res.json({
      message: 'Withdrawal rejected',
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting withdrawal', error: error.message });
  }
});

module.exports = router;
