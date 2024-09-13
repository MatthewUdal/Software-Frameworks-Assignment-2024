const express = require('express');
const router = express.Router();
const ChannelService = require('../models/ChannelService');
const UserService = require('../models/UserService');

// Route to get all channels
router.get('/', async (req, res) => {
    try {
        const channels = await ChannelService.getAllChannels();
        res.json(channels);
    } catch (err) {
        console.error('Error reading channel data:', err);
        res.sendStatus(500);
    }
});

// Route to get all channels a specific user is in
router.post('/myChannels', async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ success: false, message: 'UserID is required' });
    }

    try {
        const user = await UserService.findUserByID(userID);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Admins can access all channels
        if (user.role === 'superAdmin' || user.role === 'groupAdmin') {
            const allChannels = await ChannelService.getAllChannels();
            return res.json(allChannels);
        }

        // Regular users can access only their channels
        const userChannels = await ChannelService.getUserChannels(userID);
        res.json(userChannels);
    } catch (err) {
        console.error('Error reading channel data:', err);
        res.sendStatus(500);
    }
});

// Route to add a new channel to a group
router.post('/addChannel', async (req, res) => {
    const { groupID, name, userID } = req.body;
    
    if (!groupID || !name || !userID) {
        return res.status(400).json({ success: false, message: 'GroupID, name, and userID are required' });
    }

    try {
        const newChannel = await ChannelService.addChannel(groupID, name, userID);
        res.status(201).json(newChannel);
    } catch (err) {
        console.error('Error adding channel:', err);
        res.sendStatus(500);
    }
});

// Route to delete a channel from a group
router.post('/deleteChannel', async (req, res) => {
    const { channelID } = req.body;

    if (!channelID) {
        return res.status(400).json({ success: false, message: 'ChannelID is required' });
    }

    try {
        const result = await ChannelService.deleteChannel(channelID);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error deleting channel:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
