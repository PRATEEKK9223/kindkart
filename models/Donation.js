const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  items: [{ itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, name: String, qty: Number }],
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  donor: {
    name: String,
    contact: String
  },
  preference: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
