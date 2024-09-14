const express = require('express');
const router = express.Router();
const ChannelRequestService = require('../models/ChannelRequestsService');
const ChannelService = require('../models/ChannelService');
const UserService = require('../models/UserService');

// Route to get all channel join requests for a group
router.post('/getRequests', async (req, res) => {
    const { groupID } = req.body;

    if (!groupID) {
        return res.status(400).json({ message: 'GroupID is required' });
    }

    try {
        // Fetch channel requests for the specified group
        const channelRequests = await ChannelRequestService.readRequests({ groupID });

        // Fetch user and channel details for each request
        const userRequests = await Promise.all(channelRequests.map(async request => {
            const user = await UserService.findUserByID(request.userID, 'username');
            const channel = await ChannelService.getChannelById(request.channelID);

            return {
                channelRequestID: request._id, // Use _id for MongoDB
                userID: request.userID,
                username: user ? user.username : 'Unknown',
                channelID: request.channelID,
                channelName: channel ? channel.name : 'Unknown'
            };
        }));

        res.json(userRequests);
    } catch (err) {
        console.error('Error fetching channel requests:', err);
        res.sendStatus(500);
    }
});

// Route to accept a user into a channel
router.post('/approveRequest', async (req, res) => {
    const { userID, channelRequestID, channelID } = req.body;

    try {

        await ChannelRequestService.deleteRequest(channelRequestID);

        const channel = await ChannelService.getChannelById(channelID);

        if (!channel) {
            return res.status(404).json({ success: false, message: 'Channel not found' });
        }

        if (!channel.members.includes(userID)) {
            channel.members.push(userID);
            await ChannelService.saveChannel(channel);
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Error approving request:', err);
        res.sendStatus(500);
    }
});

// Route to decline a user from joining the channel and delete the join request
router.post('/declineRequest', async (req, res) => {
    const { channelRequestID } = req.body;

    try {
        await ChannelRequestService.deleteRequest(channelRequestID);

        res.json({ success: true, message: 'Channel request removed successfully' });
    } catch (err) {
        console.error('Error declining request:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
