
const express = require('express');
const router = express.Router();
const GroupService = require('../models/GroupService');

router.post('/', async (req, res) => {
  const { groupID, userID } = req.body;

  try {
    const groups = await GroupService.readGroups();
    const group = groups.find(group => group.groupID === groupID);

    if (group) {
      const isAdmin = group.adminIDs.includes(userID);
      console.log(isAdmin);
      res.json({ success: isAdmin });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error('Error processing group data:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
