const express = require('express');
const router = express.Router();
const GroupService = require('../models/GroupService');

// Route to check if a user is an admin of the group
router.post('/', async (req, res) => {
  const { groupID, userID } = req.body;

  if (!groupID || !userID) {
    return res.status(400).json({ message: 'GroupID and UserID are required' });
  }

  try {
    const group = await GroupService.findGroupByID(groupID);

    if (group) {
      const isAdmin = group.adminIDs.includes(userID);
      console.log(isAdmin);
      res.json({ success: isAdmin });
    } else {
      res.json({ success: false, message: 'Group not found' });
    }
  } catch (err) {
    console.error('Error processing group data:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
