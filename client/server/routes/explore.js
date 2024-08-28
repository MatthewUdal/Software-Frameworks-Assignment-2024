const express = require('express');
const router = express.Router();
const GroupService = require('../models/GroupService');
const RequestService = require('../models/RequestService');
const Request = require('../models/Request');

router.post('/', async (req, res) => {
    const { userID } = req.body;

    try {
        let groups = await GroupService.readGroups();
        groups = groups.filter(group => !group.memberIDs.includes(userID));
        res.json(groups);
    } catch (err) {
        console.error('Error reading group data:', err);
        res.sendStatus(500);
    }
});

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
