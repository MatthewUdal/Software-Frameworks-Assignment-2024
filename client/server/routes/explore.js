const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Group = require('../models/Group');
const Request = require('../models/Request');

const groupFilePath = path.join(__dirname, '..', 'data', 'groups.json');
const requestFilePath = path.join(__dirname, '..', 'data', 'requests.json');

router.post('/', (req, res) => {
    const { userID } = req.body;
  
    fs.readFile(groupFilePath, 'utf8', (err, data) => {
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

  router.post('/join', (req, res) => {
    const { userID, groupID } = req.body;
  
    fs.readFile(groupFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading group data:', err);
        return res.sendStatus(500);
      }
  
      let groupData = JSON.parse(data);
      const groupIndex = groupData.findIndex(group => group.groupID === groupID);
  
      if (groupIndex === -1) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      // check if member isn't in group already
      console.log(groupData[groupIndex]);
      if (!groupData[groupIndex].memberIDs.includes(userID)) {
  
        // read and write to requests
        fs.readFile(requestFilePath, 'utf8', (err, requestData) => {
          if (err) {
            console.error('Error reading request data:', err);
            return res.sendStatus(500);
          }

          let requests = JSON.parse(requestData);

          const existingRequest = requests.find(request => request.userID === userID && request.groupID === groupID);
          if (existingRequest) {
            return res.status(400).json({ message: 'Request already exists' });
          }

          const newRequestID = requests.length ? requests[requests.length - 1].requestID + 1 : 1;
          const newRequest = new Request(newRequestID, groupID, userID);

          requests.push(newRequest);

          fs.writeFile(requestFilePath, JSON.stringify(requests, null, 2), err => {
            if (err) {
              console.error('Error writing to request data file:', err);
              return res.sendStatus(500);
            }
            res.json({ message: 'Request Sent', groupID, requestID: newRequestID });
          });
        });
      } else {
        res.status(400).json({ message: 'User already in the group' });
      }
    });
  });

module.exports = router;
