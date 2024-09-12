const mongoose = require('mongoose');

// Define the request schema
const requestSchema = new mongoose.Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Referencing the Group model
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
    required: true,
  }
});

// Create the request model
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
