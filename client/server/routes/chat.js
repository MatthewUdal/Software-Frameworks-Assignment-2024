const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const multer = require('multer'); 
const path = require('path');     

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
      message: message.message,
      timestamp: message.timestamp
    }));

    res.json(mappedMessages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload image route
router.post('/uploadImage', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  
  // Respond with the image URL
  res.json({ imageUrl });
});


module.exports = router;
