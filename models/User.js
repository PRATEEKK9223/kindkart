const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String, // for demo only - store hashed passwords in prod
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
