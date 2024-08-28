const express = require('express');
const router = express.Router();
const ChannelService = require('../models/ChannelService');
const Channel = require('../models/Channel');

router.get('/', async (req, res) => {
    try {
        const channels = await ChannelService.readChannels();
        res.json(channels);
    } catch (err) {
        console.error('Error reading channel data:', err);
        res.sendStatus(500);
    }
});

router.post('/addChannel', async (req, res) => {
    try {
        const channels = await ChannelService.readChannels();
        
        const newChannelID = channels.length ? Math.max(...channels.map(channel => channel.channelID)) + 1 : 1;
        const newChannel = new Channel(newChannelID, req.body.groupID, req.body.name);

        channels.push(newChannel);

        await ChannelService.writeChannels(channels);
        res.status(201).json(newChannel);
    } catch (err) {
        console.error('Error adding channel:', err);
        res.sendStatus(500);
    }
});

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
