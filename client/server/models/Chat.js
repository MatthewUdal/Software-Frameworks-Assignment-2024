const mongoose = require('mongoose');

// Define the chat schema
const chatSchema = new mongoose.Schema({
  channelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel', // Referencing the Channel model
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Sets the current date and time
  }
});

// Create the chat model, ensuring it is only created once
const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

module.exports = Chat;
