const express = require('express');
const router = express.Router();
const GroupService = require('../models/GroupService');
const Report = require('../models/Report');
const UserService = require('../models/UserService');

// Route to remove a user from a group and add their userID to the blacklist
router.post('/', async (req, res) => {
    const { userID, groupID } = req.body;

    try {
        const group = await GroupService.findGroupByID(groupID);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        const user = await UserService.findUserByID(userID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'superAdmin') {
            return res.status(403).json({ success: false, message: 'Cannot ban or report a superAdmin' });
        }

        await GroupService.removeMember(groupID, userID);

        if (!group.blacklistedIDs.includes(userID)) {
            group.blacklistedIDs.push(userID);
        }

        await GroupService.updateGroup(groupID, { blacklistedIDs: group.blacklistedIDs });

        const newReport = new Report({
            userID: userID
        });
        await newReport.save();

        res.json({ success: true, message: 'User banned and reported successfully' });

    } catch (err) {
        console.error('Error banning user:', err);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

module.exports = router;
