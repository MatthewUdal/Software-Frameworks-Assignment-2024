const express = require('express');
const router = express.Router();
const UserService = require('../models/UserService');

// Route to check user credentials
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const foundUser = await UserService.findUser(email, password);

        if (foundUser) {
            const { password: userPassword, ...userWithoutPassword } = foundUser.toObject();
            res.json({ success: true, user: userWithoutPassword });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error finding user:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
