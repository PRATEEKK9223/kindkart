const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const NGO = require('../models/NGO');
const Donation = require('../models/Donation');

// basic multer local storage for logos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware to protect admin routes
function isAdmin(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please log in as admin.');
  res.redirect('/admin/login');
}

// Admin login form
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// Admin login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password }); // demo only - plain text
  if (!user) {
    req.flash('error', 'Invalid credentials.');
    return res.redirect('/admin/login');
  }
  req.session.userId = user._id;
  req.flash('success', 'Logged in.');
  res.redirect('/admin/dashboard');
});

// Admin logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  const donations = await Donation.find({}).limit(10).populate('ngo').sort('-createdAt');
  res.render('admin/dashboard', { donations });
});

// NGO CRUD (list)
router.get('/ngos', isAdmin, async (req, res) => {
  const ngos = await NGO.find({});
  res.render('admin/ngos', { ngos });
});

// Create NGO form (on same page as list you can implement)
router.post('/ngos', isAdmin, upload.single('logo'), async (req, res) => {
  const { name, description, city, accepts, address } = req.body;
  const ngo = new NGO({
    name, description, city, accepts: (accepts || '').split(',').map(s => s.trim()), address
  });
  if (req.file) ngo.logo = '/uploads/' + req.file.filename;
  await ngo.save();
  req.flash('success', 'NGO created');
  res.redirect('/admin/ngos');
});

// Donations list
router.get('/donations', isAdmin, async (req, res) => {
  const donations = await Donation.find({}).populate('ngo').sort('-createdAt');
  res.render('admin/donations', { donations });
});

module.exports = router;
