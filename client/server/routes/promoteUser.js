const express = require('express');
const router = express.Router();
const UserService = require('../models/UserService');
const GroupService = require('../models/GroupService');

// route to change a user's role
router.post('/', async (req, res) => {
    const { userID, newRole } = req.body;

    try {
        const user = await UserService.findUserByID(userID);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.role = newRole;
        await user.save(); 

        const userGroups = await GroupService.getGroupsByUserID(userID);

        userGroups.forEach(async (group) => {
            if (!group.adminIDs.includes(userID)) {
                group.adminIDs.push(userID);
                await group.save(); 
            }
        });

        res.json({ success: true, message: 'User role updated and added to admin list successfully' });
    } catch (err) {
        console.error('Error processing request:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
