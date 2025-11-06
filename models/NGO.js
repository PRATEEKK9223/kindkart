const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  accepts: [String],
  city: String,
  address: String,
  lat: Number,
  lng: Number,
  verified: { type: Boolean, default: false },
  logo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NGO', ngoSchema);
