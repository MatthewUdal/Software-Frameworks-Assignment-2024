const express = require('express');
const router = express.Router();
const UserService = require('../models/UserService');

// Route to verify userID is linked to a user account
router.post('/verifyUser', async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ success: false, message: 'UserID is required' });
    }

    try {
        const user = await UserService.findUserByID(userID);

        if (user) {
            return res.json({ success: true, message: 'User is valid' });
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('Error verifying user:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
