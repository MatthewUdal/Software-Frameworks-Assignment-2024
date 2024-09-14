const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const Group = require('../models/Group');

// Route to get all group join requests
router.post('/getRequests', async (req, res) => {
    const { groupID } = req.body;

    try {
        const requests = await Request.find({ groupID });

        const userRequests = await Promise.all(requests.map(async request => {
            const user = await User.findById(request.userID, 'username'); 
            return {
                requestID: request._id,
                userID: request.userID,
                username: user ? user.username : 'Unknown'
            };
        }));

        res.json(userRequests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.sendStatus(500);
    }
});

// Route to accept a user into the group
router.post('/approveRequest', async (req, res) => {
    const { userID, requestID, groupID } = req.body;

    try {
        await Request.findByIdAndDelete(requestID);

        const group = await Group.findById(groupID);

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        if (!group.memberIDs.includes(userID)) {
            group.memberIDs.push(userID);
            await group.save();
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error approving request:', err);
        res.sendStatus(500);
    }
});

// Route to reject a user from the group and delete the join request
router.post('/declineRequest', async (req, res) => {
    const { requestID } = req.body;

    try {
        await Request.findByIdAndDelete(requestID);

        res.json({ success: true, message: 'Request removed successfully' });
    } catch (err) {
        console.error('Error declining request:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
