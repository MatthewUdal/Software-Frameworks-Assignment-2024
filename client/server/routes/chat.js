const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

// Route to get the last 5 messages from a channel
router.get('/getMessages', async (req, res) => {
  const { channelID } = req.params;
  
  try {
    const messages = await Chat.find({ channelID })
      .sort({ _id: -1 }) // Get latest messages
      .limit(5)
      .populate('userID', 'username role'); // Populate user info
    res.json(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
