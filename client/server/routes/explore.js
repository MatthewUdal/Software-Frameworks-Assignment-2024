const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Group = require('../models/Group');

const filePath = path.join(__dirname, '..', 'data', 'groups.json');

router.post('/', (req, res) => {
    const { userID } = req.body;
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading group data:', err);
        return res.sendStatus(500);
      }
  
      let groupData  = JSON.parse(data);

      let groups = groupData.map(group => new Group(group.groupID, group.memberIDs, group.name));
      groups = groups.filter(group => !group.memberIDs.includes(userID));
  
      res.json(groups);
    });
  });

module.exports = router;
