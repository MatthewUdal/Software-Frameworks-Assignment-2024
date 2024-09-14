const express = require('express');
const router = express.Router();
const GroupService = require('../models/GroupService');
const UserService = require('../models/UserService');
const RequestService = require('../models/RequestService');
const ChannelService = require('../models/ChannelService');

// Route to get all groups a user is in
router.post('/', async (req, res) => {
    const { userID } = req.body;

    try {
        const foundUser = await UserService.findUserByID(userID);

        if (!foundUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        let groups;
        if (foundUser.role === 'superAdmin') {
            groups = await GroupService.getAllGroups();
        } else {
            groups = await GroupService.getGroupsByUserID(userID);
        }

        res.json(groups);
    } catch (err) {
        console.error('Error fetching groups:', err);
        res.sendStatus(500);
    }
});

// Route to create a new group
router.post('/createGroup', async (req, res) => {
    const { userID, groupName } = req.body;

    try {
        if (!userID || !groupName) {
            return res.status(400).json({ error: 'UserID and groupName are required.' });
        }

        const newGroup = await GroupService.createGroup(groupName, userID);
        res.status(201).json(newGroup);
    } catch (err) {
        console.error('Error creating group:', err);
        res.sendStatus(500);
    }
});

// Route to leave a group
router.post('/leaveGroup', async (req, res) => {
    const { groupID, userID } = req.body;

    try {
        const foundUser = await UserService.findUserByID(userID);

        if (!foundUser) {
            return res.sendStatus(404);
        }

        if (foundUser.role === 'superAdmin') {
            return res.status(400).json({ message: 'Super admin cannot leave a group' });
        }

        const group = await GroupService.findGroupByID(groupID);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.memberIDs.includes(userID)) {
            return res.status(400).json({ message: 'User is not a member of the group' });
        }

        await GroupService.removeMember(groupID, userID);
        res.status(200).json({ message: 'User removed from group' });
    } catch (err) {
        console.error('Error leaving group:', err);
        res.sendStatus(500);
    }
});

// // Route to delete a group and all associated channels
// router.post('/deleteGroup', async (req, res) => {
//     const { groupID } = req.body;

//     try {
//         await GroupService.deleteGroup(groupID);
//         await ChannelService.deleteChannelsByGroupID(groupID);
//         await RequestService.deleteRequestsByGroupID(groupID);

//         res.status(200).json({ message: 'Deleted group and all related data' });
//     } catch (err) {
//         console.error('Error deleting group:', err);
//         res.sendStatus(500);
//     }
// });

// Route to return all members in a group
router.post('/getMembers', async (req, res) => {
    const { groupID } = req.body;

    if (!groupID) {
        return res.status(400).json({ error: 'groupID is required' });
    }

    try {
        const members = await GroupService.getMembers(groupID);
        console.log(members);

        res.status(200).json(members); 
    } catch (err) {
        console.error('Error fetching members:', err);
        res.sendStatus(500);
    }
});

// Route to kick a user from a group
router.post('/kickUser', async (req, res) => {
    const { groupID, userID } = req.body;
    
    try {
        const foundUser = await UserService.findUserByID(userID);

        if (!foundUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (['superAdmin', 'groupAdmin'].includes(foundUser.role)) {
            return res.status(403).json({ success: false, message: 'Cannot kick a superAdmin or groupAdmin' });
        }

        const group = await GroupService.findGroupByID(groupID);

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        await GroupService.removeMember(groupID, userID);
        res.json({ success: true, message: 'User kicked from the group successfully' });
    } catch (err) {
        console.error('Error kicking user:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
