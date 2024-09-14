const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const ChannelRequestsService = require('../models/ChannelRequestsService');

// Route to get every joinable channel in the current group for a user
router.post('/', async (req, res) => {
    const { userID, groupID } = req.body;

    console.log(groupID);

    if (!userID) {
        return res.status(400).json({ success: false, message: 'UserID is required' });
    }

    try {
        const groupChannels = await Channel.find({ groupID });

        const channelRequests = await ChannelRequestsService.readRequests();

        const requestedChannelIDs = channelRequests
            .filter(request => request.userID.toString() === userID)
            .map(request => request.channelID.toString());

        const joinableChannels = groupChannels.filter(channel =>
            !channel.members.includes(userID) && !requestedChannelIDs.includes(channel._id.toString())
        );

        
        res.json(joinableChannels);
    } catch (err) {
        console.error('Error reading channel data:', err);
        res.sendStatus(500);
    }
});

// Route to add a userID to a channel's member array
router.post('/join', async (req, res) => {
    const { userID, channelID, groupID } = req.body;

    try {
        const channel = await Channel.findById(channelID);

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        if (channel.members.includes(userID)) {
            return res.status(400).json({ message: 'User already in the channel' });
        }

        const existingRequest = await ChannelRequestsService.readRequests();
        const requestExists = existingRequest.some(request =>
            request.userID.toString() === userID && request.channelID.toString() === channelID
        );
        
        if (requestExists) {
            return res.status(400).json({ message: 'Request already exists' });
        }

        const requestID = await ChannelRequestsService.createRequest(userID, channelID, groupID);

        res.json({ message: 'Request Sent', channelID, requestID, channelName: channel.name });
    } catch (err) {
        console.error('Error processing request:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
