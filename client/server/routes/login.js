const express = require('express');
const router = express.Router();

// Define the login route
router.post('/', (req, res) => {
  const { email, password } = req.body;
  
  // Sample users database
  const users = [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' },
    { email: 'user3@example.com', password: 'password3' }
  ];

  // Find user with matching credentials
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;
