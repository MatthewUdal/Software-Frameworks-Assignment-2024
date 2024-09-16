const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const Group = require('../models/Group');
const Report = require('../models/Report');
const Request = require('../models/Request');
const ChannelRequest = require('../models/ChannelRequest');
const User = require('../models/User');

// route to delete a userID from every possible source of data
router.post('/', async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ success: false, message: 'UserID is required' });
    }

    try {
        // Remove user from all channels' member lists
        await Channel.updateMany(
            { members: userID },
            { $pull: { members: userID } }
        );

        // Remove user from all groups' member lists, admin lists, and blacklist
        await Group.updateMany(
            { $or: [{ memberIDs: userID }, { adminIDs: userID }, { blacklistedIDs: userID }] },
            { $pull: { memberIDs: userID, adminIDs: userID, blacklistedIDs: userID } }
        );

        // Delete all reports associated with the user
        await Report.deleteMany({ userID: userID });

        // Delete all group join requests associated with the user
        await Request.deleteMany({ userID: userID });

        // Delete all channel join requests associated with the user
        await ChannelRequest.deleteMany({ userID: userID });

        // Delete the user from the User collection
        const deletedUser = await User.findByIdAndDelete(userID);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: `User ${userID} and associated data removed successfully` });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

module.exports = router;
