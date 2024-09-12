const mongoose = require('mongoose');

// Define the requestChannel schema
const requestChannelSchema = new mongoose.Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Referencing the Group model
    required: true,
  },
  channelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel', // Referencing the Channel model
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
    required: true,
  }
});

// Create the requestChannel model
const RequestChannel = mongoose.model('RequestChannel', requestChannelSchema);

module.exports = RequestChannel;
