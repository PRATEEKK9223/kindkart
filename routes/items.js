const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// List items
router.get('/', async (req, res) => {
  const q = {};
  if (req.query.category) q.category = req.query.category;
  const items = await Item.find(q).sort('name');
  res.render('items', { items, category: req.query.category || 'All' });
});

// Item detail (modal or page)
router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.redirect('/items');
  res.render('item_detail', { item });
});

module.exports = router;
