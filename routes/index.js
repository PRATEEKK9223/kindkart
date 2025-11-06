const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Story = require('../models/Story');
const NGO = require('../models/NGO');

// Home
router.get('/', async (req, res) => {
  try {
    const totalDonatedItems = 0; // optional: compute from donations
    const topNGOs = await NGO.find({}).limit(3);
    res.render('index', { topNGOs, totalDonatedItems });
  } catch (err) {
    req.flash('error', 'Unable to load home.');
    res.render('index', { topNGOs: [], totalDonatedItems: 0 });
  }
});

// Stories
router.get('/stories', async (req, res) => {
  const stories = await Story.find({}).populate('ngo').limit(10);
  res.render('stories', { stories });
});

// Accessibility page (static)
router.get('/accessibility', (req, res) => {
  res.render('accessibility');
});

// Cart page (client-side cart stored in localStorage)
router.get('/cart', (req, res) => {
  res.render('cart');
});

module.exports = router;
