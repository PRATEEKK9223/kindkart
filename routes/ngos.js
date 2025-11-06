const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');

// List NGOs with optional filters
router.get('/', async (req, res) => {
  const { city, category } = req.query;
  const q = {};
  if (city) q.city = city;
  if (category) q.accepts = category;
  const ngos = await NGO.find(q).limit(50);
  res.render('ngos', { ngos, city, category });
});

// NGO detail
router.get('/:id', async (req, res) => {
  const ngo = await NGO.findById(req.params.id);
  if (!ngo) return res.redirect('/ngos');
  res.render('ngo_detail', { ngo });
});

module.exports = router;
