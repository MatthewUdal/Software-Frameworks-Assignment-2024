const express = require('express');
const router = express.Router();
const GroupService = require('../models/GroupService');
const RequestService = require('../models/RequestService');
const Request = require('../models/Request');

// route to get every joinable group for a specific user
router.post('/', async (req, res) => {
    const { userID } = req.body;

    try {
        let groups = await GroupService.readGroups();
        let requests = await RequestService.readRequests();

        const requestedGroupIDs = requests.filter(request => request.userID === userID).map(request => request.groupID);

        groups = groups.filter(group => !group.memberIDs.includes(userID) && !group.blacklistedIDs.includes(userID) && !requestedGroupIDs.includes(group.groupID));
        res.json(groups);
    } catch (err) {
        console.error('Error reading group data:', err);
        res.sendStatus(500);
    }
});

// route to create a join request to a group
router.post('/join', async (req, res) => {
    const { userID, groupID } = req.body;

    try {
        let groups = await GroupService.readGroups();
        const groupIndex = groups.findIndex(group => group.groupID === groupID);

        if (groupIndex === -1) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const group = groups[groupIndex];
        if (group.memberIDs.includes(userID)) {
            return res.status(400).json({ message: 'User already in the group' });
        }

        let requests = await RequestService.readRequests();
        const existingRequest = requests.find(request => request.userID === userID && request.groupID === groupID);

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already exists' });
        }

        const newRequestID = requests.length ? requests[requests.length - 1].requestID + 1 : 1;
        const newRequest = new Request(newRequestID, groupID, userID);

        requests.push(newRequest);
        await RequestService.writeRequests(requests);

        res.json({ message: 'Request Sent', groupID, requestID: newRequestID, groupName: group.name });
    } catch (err) {
        console.error('Error processing request:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
