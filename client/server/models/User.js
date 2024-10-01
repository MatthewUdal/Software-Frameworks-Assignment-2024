const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  profilePicture: {
    type: String, // Field for storing the URL/path to the profile picture
    default: '/api/profilePictures/default.png',
  }
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
