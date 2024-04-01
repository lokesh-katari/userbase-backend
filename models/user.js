// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id:{
    type: Number,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  avatar: {
    type: String
  },
  domain: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

