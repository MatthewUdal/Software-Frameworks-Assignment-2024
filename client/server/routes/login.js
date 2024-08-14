const express = require('express');
const router = express.Router();
const UserStore = require('../models/UserStore');
const User = require('../models/User');

const userStore = new UserStore();

// Define the login route
router.post('/', (req, res) => {
  const { email, password, userList } = req.body;
  
  storedList = JSON.parse(userList).map(u => new User(u.userID, u.username, u.email, u.password, u.role, u.groups));
  console.log(storedList);

  const user = storedList.find(u => u.email === email && u.password === password);
  console.log(user)
  
  if (user) {
    // Exclude password from response (create new const 'userWithoutPassword with user details minus the password)
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;
