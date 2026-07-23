const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/auth');
const Settings = require('../models/Settings');
const User = require('../models/User');
const Ad = require('../models/Ad');
const Withdrawal = require('../models/Withdrawal');

// Get Dashboard Stats
router.get('/stats', adminProtect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEarned = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEarned' } } },
    ]);
    const totalWithdrawn = await Withdrawal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    const totalAds = await Ad.countDocuments();

    res.json({
      totalUsers,
      totalEarned: totalEarned[0]?.total || 0,
      totalWithdrawn: totalWithdrawn[0]?.total || 0,
      pendingWithdrawals,
      totalAds,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get Settings
router.get('/settings', adminProtect, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Update Settings
router.put('/settings', adminProtect, async (req, res) => {
  try {
    const { earningsPerAd, minimumWithdrawal, maxAdsPerDay } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    settings.earningsPerAd = earningsPerAd || settings.earningsPerAd;
    settings.minimumWithdrawal = minimumWithdrawal || settings.minimumWithdrawal;
    settings.maxAdsPerDay = maxAdsPerDay || settings.maxAdsPerDay;
    settings.updatedBy = req.adminId;

    await settings.save();
    res.json({ message: 'Settings updated', settings });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// Get All Users
router.get('/users', adminProtect, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get User Details
router.get('/users/:id', adminProtect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Create Ad
router.post('/ads', adminProtect, async (req, res) => {
  try {
    const { title, description, adUrl, videoUrl, imageUrl, duration, earning } = req.body;

    const ad = new Ad({
      title,
      description,
      adUrl,
      videoUrl,
      imageUrl,
      duration: duration || 30,
      earning: earning || 0.5,
    });

    await ad.save();
    res.status(201).json({ message: 'Ad created successfully', ad });
  } catch (error) {
    res.status(500).json({ message: 'Error creating ad', error: error.message });
  }
});

// Get All Ads
router.get('/ads', adminProtect, async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ads', error: error.message });
  }
});

// Update Ad
router.put('/ads/:id', adminProtect, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Ad updated', ad });
  } catch (error) {
    res.status(500).json({ message: 'Error updating ad', error: error.message });
  }
});

// Delete Ad
router.delete('/ads/:id', adminProtect, async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ad deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ad', error: error.message });
  }
});

module.exports = router;
