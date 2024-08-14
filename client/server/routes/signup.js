const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Define the signup route
router.post('/', (req, res) => {
  const { username, email, userList } = req.body;
  
  // Convert input values to lowercase for case-insensitive comparison
  const lowercaseUsername = username.toLowerCase();
  const lowercaseEmail = email.toLowerCase();
    
 
  let storedList;
  try {
    storedList = JSON.parse(userList).map(u => new User(u.userID, u.username.toLowerCase(), u.email.toLowerCase(), u.password, u.role, u.groups));
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid user list format.' });
  }

  // Check for existing email or username
  const existingUser = storedList.find(u => u.email === lowercaseEmail || u.username === lowercaseUsername);
  
  if (existingUser) {
    if (existingUser.email === lowercaseEmail && existingUser.username === lowercaseUsername) {
      res.json({ success: false, message: 'Account already exists.' });
    } else if (existingUser.email === lowercaseEmail) {
      res.json({ success: false, message: 'Email already exists.' });
    } else if (existingUser.username === lowercaseUsername) {
      res.json({ success: false, message: 'Username already exists.' });
    }
  } else {

    const highestID = storedList.reduce((max, user) => Math.max(max, user.userID), 0);
    const newUserID = highestID + 1;

    res.json({ success: true, newID: newUserID });
  }
});

module.exports = router;
