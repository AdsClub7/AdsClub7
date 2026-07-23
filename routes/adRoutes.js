const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Ad = require('../models/Ad');
const Settings = require('../models/Settings');

// Get All Active Ads for Users
router.get('/', protect, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const ads = await Ad.find({ status: 'active', isActive: true })
      .select('title description videoUrl imageUrl duration earning status')
      .sort({ createdAt: -1 });

    res.json({
      ads,
      currentEarningPerAd: settings?.earningsPerAd || 0.5,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ads', error: error.message });
  }
});

// Get Single Ad
router.get('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ad', error: error.message });
  }
});

module.exports = router;
