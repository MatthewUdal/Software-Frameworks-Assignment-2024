const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Group = require('../models/Group');

const filePath = path.join(__dirname, '..', 'data', 'groups.json');

router.post('/', (req, res) => {
  const { groupID, userID } = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading group data:', err);
      return res.sendStatus(500);
    }

    const groupData = JSON.parse(data);
    const groups = groupData.map(group => new Group(group.groupID, group.memberIDs, group.name, group.adminIDs));

    const group = groups.find(group => group.groupID === groupID);

    if (group) {
      const isAdmin = group.adminIDs.includes(userID);
      console.log(isAdmin)

      res.json({ success: isAdmin });
    } else {
      res.json({ success: false });
    }
  });
});

module.exports = router;
