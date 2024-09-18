const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

router.post('/getMessages', async (req, res) => {
  const { channelID } = req.body;

  try {
    const messages = await Chat.find({ channelID })
      .sort({ _id: -1 })
      .limit(5)
      .populate('userID', 'username role');
    
    // Map the messages to include username and role
    const mappedMessages = messages.map((message) => ({
      chatID: message._id, 
      channelID: message.channelID,
      userID: message.userID._id,
      username: message.userID.username,
      role: message.userID.role,
      message: message.message
    }));

    res.json(mappedMessages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
