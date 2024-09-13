const mongoose = require('mongoose');

// Define the group schema
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  memberIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
  }],
  adminIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
  }],
  blacklistedIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
  }]
}, { timestamps: true }); // Add timestamps to track creation and updates

// Create the group model
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
