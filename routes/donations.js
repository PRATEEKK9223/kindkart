const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const NGO = require('../models/NGO');
const Item = require('../models/Item');

// POST donation (from cart)
router.post('/', async (req, res) => {
  try {
    // expected payload: itemsJson (stringified array), ngoId, donor[name,contact], preference
    const { itemsJson, ngoId, donorName, donorContact, preference } = req.body;
    let items = [];
    try { items = JSON.parse(itemsJson || '[]'); } catch(e) { items = []; }

    // ensure ngo exists
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      req.flash('error', 'Selected NGO not found.');
      return res.redirect('/cart');
    }

    // create donation object
    const donation = new Donation({
      items: items.map(i => ({ itemId: i._id, name: i.name, qty: i.qty })),
      ngo: ngo._id,
      donor: { name: donorName, contact: donorContact },
      preference
    });

    await donation.save();

    // optionally: add server-side notifications/emails here

    res.render('confirm', { donation, ngo });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to process donation.');
    res.redirect('/cart');
  }
});

module.exports = router;
