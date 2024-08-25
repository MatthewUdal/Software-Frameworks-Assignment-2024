const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require('../models/User');

router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const filePath = path.join(__dirname, '..', 'data', 'users.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading user data:', err);
      return res.sendStatus(500);
    }

    let users = JSON.parse(data).map(user => new User(user.userID, user.username, user.email, user.password, user.role));

    const foundUser = users.find(user => user.email === email && user.password === password);
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});

module.exports = router;
