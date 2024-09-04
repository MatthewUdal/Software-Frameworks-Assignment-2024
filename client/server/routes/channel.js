const express = require('express');
const router = express.Router();
const ChannelService = require('../models/ChannelService');
const Channel = require('../models/Channel');
const UserService = require('../models/UserService');

// route to get eall channels
router.get('/', async (req, res) => {
    try {
        const channels = await ChannelService.readChannels();
        res.json(channels);
    } catch (err) {
        console.error('Error reading channel data:', err);
        res.sendStatus(500);
    }
});

// route to get all channels a specific user is in
router.post('/myChannels', async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ success: false, message: 'UserID is required' });
    }

    try {        
        const channels = await ChannelService.readChannels();
        const users = await UserService.readUsers();

        const foundUser = users.find(user => user.userID === userID);

        if (!foundUser) {
            return res.sendStatus(404);
        }

        if (foundUser.role === 'superAdmin' || foundUser.role === 'groupAdmin') {
            return res.json(channels);
        }


        const filteredChannels = channels.filter(channel => channel.members.includes(userID));
        res.json(filteredChannels);
    } catch (err) {
        console.error('Error reading channel data:', err);
        res.sendStatus(500);
    }
});

// route to add a new channel to a group
router.post('/addChannel', async (req, res) => {
    try {
        const channels = await ChannelService.readChannels();
        
        const newChannelID = channels.length ? Math.max(...channels.map(channel => channel.channelID)) + 1 : 1;
        const newChannel = new Channel(newChannelID, req.body.groupID, req.body.name, [req.body.userID]);

        channels.push(newChannel);

        await ChannelService.writeChannels(channels);
        res.status(201).json(newChannel);
    } catch (err) {
        console.error('Error adding channel:', err);
        res.sendStatus(500);
    }
});

// route to delete a channel from a group
router.post('/deleteChannel', async (req, res) => {
    try {
        const { channelID } = req.body;
        let channels = await ChannelService.readChannels();
        
        const updatedChannels = channels.filter(channel => channel.channelID !== channelID);

        await ChannelService.writeChannels(updatedChannels);
        res.status(200).json({ message: 'Channel deleted successfully' });
    } catch (err) {
        console.error('Error deleting channel:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
