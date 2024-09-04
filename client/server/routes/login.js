const express = require('express');
const router = express.Router();
const UserService = require('../models/UserService');

// route to check user credientials 
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const users = await UserService.readUsers();

        const foundUser = users.find(user => user.email === email && user.password === password);
        if (foundUser) {
            const { password, ...userWithoutPassword } = foundUser;
            res.json({ success: true, user: userWithoutPassword });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error reading user data:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
