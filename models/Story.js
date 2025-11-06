const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: String,
  content: String,
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  images: [String],
  date: Date
});

module.exports = mongoose.model('Story', storySchema);
