const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require('../models/User');

router.post('/', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const filePath = path.join(__dirname, '..', 'data', 'users.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading user data:', err);
      return res.sendStatus(500);
    }

    let users = JSON.parse(data).map(user => new User(user.userID, user.username, user.email, user.password, user.role));

    const existingUser = users.find(user => user.email === email || user.username === username);
    if (existingUser) {
      let message = 'User already exists';
      if (existingUser.email === email && existingUser.username === username) {
        message = 'Email and Username already taken';
      } else if (existingUser.email === email) {
        message = 'Email already taken';
      } else if (existingUser.username === username) {
        message = 'Username already taken';
      }
      return res.status(409).json({ success: false, message });
    }

    // Auto-increment userID
    const newUserID = users.length ? Math.max(...users.map(user => user.userID)) + 1 : 1;

    const newUser = new User(
      newUserID,
      username,
      email,
      password,
      'user'
    );

    users.push(newUser);

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Error writing user data:', err);
        return res.sendStatus(500);
      }

      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json({ success: true, user: userWithoutPassword });
    });
  });
});

module.exports = router;
