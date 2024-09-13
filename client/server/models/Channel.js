const mongoose = require('mongoose');

// Define the channel schema
const channelSchema = new mongoose.Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Referencing the Group model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  members: [{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User', // Referencing the User model
  }]
});

// Create the channel model
const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
