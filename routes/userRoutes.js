const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const UserAdView = require('../models/UserAdView');
const Ad = require('../models/Ad');
const Settings = require('../models/Settings');

// Get User Profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update Bank Details
router.put('/bank-details', protect, async (req, res) => {
  try {
    const { accountNumber, ifscCode, accountHolderName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { bankDetails: { accountNumber, ifscCode, accountHolderName } },
      { new: true }
    );
    res.json({ message: 'Bank details updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bank details', error: error.message });
  }
});

// Get Earnings Stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const totalViews = await UserAdView.countDocuments({ userId: req.userId });

    res.json({
      balance: user.balance,
      totalEarned: user.totalEarned,
      adsWatched: user.adsWatched,
      totalViews,
      withdrawals: user.withdrawals,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get Ad Views History
router.get('/ad-history', protect, async (req, res) => {
  try {
    const history = await UserAdView.find({ userId: req.userId })
      .populate('adId', 'title earning')
      .sort({ viewedAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
});

// Record Ad View
router.post('/record-view', protect, async (req, res) => {
  try {
    const { adId, watchedDuration } = req.body;

    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    // Check if user already viewed this ad today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingView = await UserAdView.findOne({
      userId: req.userId,
      adId,
      viewedAt: { $gte: today },
    });

    if (existingView) {
      return res.status(400).json({ message: 'Already viewed this ad today' });
    }

    const earningAmount = ad.earning;
    const view = new UserAdView({
      userId: req.userId,
      adId,
      earnedAmount: earningAmount,
      watchedDuration,
      isCompleted: true,
    });

    await view.save();

    // Update user balance and stats
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $inc: {
          balance: earningAmount,
          totalEarned: earningAmount,
          adsWatched: 1,
        },
      },
      { new: true }
    );

    res.json({
      message: 'Ad view recorded',
      earnedAmount,
      newBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording view', error: error.message });
  }
});

module.exports = router;
