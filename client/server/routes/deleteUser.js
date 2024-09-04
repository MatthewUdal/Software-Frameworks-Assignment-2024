const express = require('express');
const router = express.Router();
const ChannelService = require('../models/ChannelService');
const GroupService = require('../models/GroupService');
const ReportService = require('../models/ReportService');
const RequestService = require('../models/RequestService');
const ChannelRequestService = require('../models/ChannelRequestsService');
const UserService = require('../models/UserService');

// route to delete a userID from every possible source of data
router.post('/', async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ success: false, message: 'UserID is required' });
    }

    try {
        let channels = await ChannelService.readChannels();
        channels = channels.map(channel => {
            channel.members = channel.members.filter(memberID => memberID !== userID);
            return channel;
        });
        await ChannelService.writeChannels(channels);

        let groups = await GroupService.readGroups();
        groups = groups.map(group => {
            group.memberIDs = group.memberIDs.filter(memberID => memberID !== userID);
            group.adminIDs = group.adminIDs.filter(adminID => adminID !== userID);
            group.blacklistedIDs = group.blacklistedIDs.filter(blackListedID => blackListedID !== userID);
            return group;
        });
        await GroupService.writeGroups(groups);

        let reports = await ReportService.readReports();
        reports = reports.filter(report => report.userID !== userID);
        await ReportService.writeReports(reports);

        let requests = await RequestService.readRequests();
        requests = requests.filter(request => request.userID !== userID);
        await RequestService.writeRequests(requests);

        let channelRequests = await ChannelRequestService.readRequests();
        channelRequests = channelRequests.filter(request => request.userID !== userID);
        await ChannelRequestService.writeRequests(channelRequests);

        let users = await UserService.readUsers();
        users = users.filter(user => user.userID !== userID);
        await UserService.writeUsers(users);

        res.json({ success: true, message: `User ${userID} and associated data removed successfully` });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
