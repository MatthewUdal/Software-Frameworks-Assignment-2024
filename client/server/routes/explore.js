const express = require('express');
const router = express.Router();
const GroupService = require('../models/GroupService');
const RequestService = require('../models/RequestService');
const Request = require('../models/Request');

// Route to get every joinable group for a specific user
router.post('/', async (req, res) => {
    const { userID } = req.body;

    try {
        let groups = await GroupService.getAllGroups();
        let requests = await RequestService.getRequestsByUserID(userID);

        const requestedGroupIDs = requests.map(request => request.groupID.toString());

        groups = groups.filter(group => 
            !group.memberIDs.includes(userID) && 
            !group.blacklistedIDs.includes(userID) &&
            !requestedGroupIDs.includes(group._id.toString())
        );
        res.json(groups);
    } catch (err) {
        console.error('Error reading group data:', err);
        res.sendStatus(500);
    }
});

// Route to create a join request to a group
router.post('/join', async (req, res) => {
    const { userID, groupID } = req.body;

    try {
        const group = await GroupService.findGroupByID(groupID);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.memberIDs.includes(userID)) {
            return res.status(400).json({ message: 'User already in the group' });
        }

        const existingRequest = await RequestService.findRequest(userID, groupID);

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already exists' });
        }

        const newRequest = await RequestService.createRequest(userID, groupID);

        res.json({ message: 'Request Sent', groupID, requestID: newRequest._id, groupName: group.name });
    } catch (err) {
        console.error('Error processing request:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
