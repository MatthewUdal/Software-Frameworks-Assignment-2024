const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const requestFilePath = path.join(__dirname, '..', 'data', 'requests.json');
const groupFilePath = path.join(__dirname, '..', 'data', 'groups.json');

router.post('/', (req, res) => {
  const { userID, requestID, groupID } = req.body;

  fs.readFile(requestFilePath, 'utf8', (err, requestData) => {
    if (err) {
      console.error('Error reading requests data:', err);
      return res.sendStatus(500);
    }

    let requests = JSON.parse(requestData);
    const requestIndex = requests.findIndex(req => req.requestID === requestID);

    if (requestIndex === -1) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Removes the request
    requests.splice(requestIndex, 1);


    fs.readFile(groupFilePath, 'utf8', (err, groupData) => {
      if (err) {
        console.error('Error reading groups data:', err);
        return res.sendStatus(500);
      }

      let groups = JSON.parse(groupData);
      const group = groups.find(g => g.groupID === groupID);

      if (!group) {
        return res.status(404).json({ success: false, message: 'Group not found' });
      }

      // Add the user to the group 
      if (!group.memberIDs.includes(userID)) {
        group.memberIDs.push(userID);
      }

      fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), (err) => {
        if (err) {
          console.error('Error saving groups data:', err);
          return res.sendStatus(500);
        }

        fs.writeFile(requestFilePath, JSON.stringify(requests, null, 2), (err) => {
          if (err) {
            console.error('Error saving requests data:', err);
            return res.sendStatus(500);
          }

          res.json({ success: true });
        });
      });
    });
  });
});

module.exports = router;
