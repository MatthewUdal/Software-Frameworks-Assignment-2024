const express = require('express');
const router = express.Router();
const RequestService = require('../models/RequestService');
const UserService = require('../models/UserService');
const GroupService = require('../models/GroupService');

router.post('/getRequests', async (req, res) => {
  const { groupID } = req.body;

  try {
    const requests = await RequestService.readRequests();
    const users = await UserService.readUsers();

    const userRequests = requests
      .filter(req => req.groupID === groupID)
      .map(request => {
        const user = users.find(user => user.userID === request.userID);
        return { requestID: request.requestID, userID: user.userID, username: user.username };
      });

    res.json(userRequests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.sendStatus(500);
  }
});


router.post('/approveRequest', async (req, res) => {
  const { userID, requestID, groupID } = req.body;

  try {
    await RequestService.deleteRequest(requestID);

    const groups = await GroupService.readGroups();
    const group = groups.find(g => g.groupID === groupID);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (!group.memberIDs.includes(userID)) {
      group.memberIDs.push(userID);
    }

    await GroupService.writeGroups(groups);

    res.json({ success: true });
  } catch (err) {
    console.error('Error approving request:', err);
    res.sendStatus(500);
  }
});


router.post('/declineRequest', async (req, res) => {
  const { requestID } = req.body;

  try {
    await RequestService.deleteRequest(requestID);
    res.json({ success: true, message: 'Request removed successfully' });
  } catch (err) {
    console.error('Error declining request:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
