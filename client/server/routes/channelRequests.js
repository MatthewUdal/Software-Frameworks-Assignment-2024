const express = require('express');
const router = express.Router();
const ChannelRequestService = require('../models/ChannelRequestsService');
const ChannelService = require('../models/ChannelService');
const UserService = require('../models/UserService');

router.post('/getRequests', async (req, res) => {
    const { groupID } = req.body;

    if (!groupID) {
        return res.status(400).json({ message: 'GroupID is required' });
    }

    try {
        const channelRequests = await ChannelRequestService.readRequests();
        const channels = await ChannelService.readChannels();
        const users = await UserService.readUsers();

        const userRequests = channelRequests
            .filter(req => req.groupID === groupID)
            .map(request => {
                const channel = channels.find(ch => ch.channelID === request.channelID);
                const user = users.find(user => user.userID === request.userID);

                return {
                    channelRequestID: request.channelRequestID,
                    channelID: request.channelID,
                    channelName: channel ? channel.name : 'Unknown',
                    userID: user ? user.userID : 'Unknown',
                    username: user ? user.username : 'Unknown'
                };
            });

        res.json(userRequests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.sendStatus(500);
    }
});


router.post('/approveRequest', async (req, res) => {
    const { userID, channelRequestID, channelID } = req.body;
  
    try {
        await ChannelRequestService.deleteRequest(channelRequestID);
        const channels = await ChannelService.readChannels();

        const channel = channels.find(ch => ch.channelID === channelID);
        if (!channel) {
            return res.status(404).json({ success: false, message: 'Channel not found' });
        }

        if (!channel.members.includes(userID)) {
            channel.members.push(userID);
        }

        await ChannelService.writeChannels(channels);

        res.json({ success: true });
    } catch (err) {
        console.error('Error approving request:', err);
        res.sendStatus(500);
    }
});

router.post('/declineRequest', async (req, res) => {
    const { channelRequestID } = req.body;
  
    try {
        await ChannelRequestService.deleteRequest(channelRequestID);
        res.json({ success: true });
    } catch (err) {
        console.error('Error removing request:', err);
        res.sendStatus(500);
    }
});

  

module.exports = router;
