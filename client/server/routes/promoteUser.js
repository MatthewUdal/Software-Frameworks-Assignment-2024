const express = require('express');
const router = express.Router();
const UserService = require('../models/UserService');
const GroupService = require('../models/GroupService');

// route to change a users role
router.post('/', async (req, res) => {
    const { userID, newRole } = req.body;

    try {
        let users = await UserService.readUsers();
        const user = users.find(u => u.userID === userID);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.role = newRole;

        let groups = await GroupService.readGroups();
        const userGroups = groups.filter(g => g.memberIDs.includes(userID));

        userGroups.forEach(group => {
            if (!group.adminIDs.includes(userID)) {
                group.adminIDs.push(userID);
            }
        });

        await GroupService.writeGroups(groups);
        await UserService.writeUsers(users);

        res.json({ success: true, message: 'User role updated and added to admin list successfully' });
    } catch (err) {
        console.error('Error processing request:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
