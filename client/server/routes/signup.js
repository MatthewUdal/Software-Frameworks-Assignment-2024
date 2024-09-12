const express = require('express');
const router = express.Router();
const UserService = require('../models/UserService');

// route to create a new user is the details are unqiue
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingUser = await UserService.userExists(username, email);
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

        const newUser = await UserService.createUser(username, email, password);
        const { password: userPassword, ...userWithoutPassword } = newUser.toObject();
        
        res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (err) {
        console.error('Error handling user data:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
