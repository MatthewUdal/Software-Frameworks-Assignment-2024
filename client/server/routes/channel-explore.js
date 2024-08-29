const express = require('express');
const router = express.Router();
const ChannelService = require('../models/ChannelService');
const ChannelRequestService = require('../models/ChannelRequestsService');

router.post('/', async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ success: false, message: 'UserID is required' });
    }

    try {
        const channels = await ChannelService.readChannels();
        const channelRequests = await ChannelRequestService.readRequests();
        
        const requestedChannelIDs = channelRequests.filter(request => request.userID === userID).map(request => request.channelID);

        const joinableChannels = channels.filter(channel => 
            !channel.members.includes(userID) && !requestedChannelIDs.includes(channel.channelID)
        );

        res.json(joinableChannels);
    } catch (err) {
        console.error('Error reading channel data:', err);
        res.sendStatus(500);
    }
});


router.post('/join', async (req, res) => {
    const { userID, channelID, groupID } = req.body;

    try {
        let channels = await ChannelService.readChannels();
        const channelIndex = channels.findIndex(channel => channel.channelID === channelID);

        if (channelIndex === -1) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        const channel = channels[channelIndex];
        if (channel.members.includes(userID)) {
            return res.status(400).json({ message: 'User already in the channel' });
        }

        let channelRequests = await ChannelRequestService.readRequests();
        const existingRequest = channelRequests.find(request => request.userID === userID && request.channelID === channelID);

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already exists' });
        }

        const newRequestID = await ChannelRequestService.createRequest(userID, channelID, groupID);

        res.json({ message: 'Request Sent', channelID, requestID: newRequestID, channelName: channel.name });
    } catch (err) {
        console.error('Error processing request:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
