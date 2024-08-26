const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');

const requestFilePath = path.join(__dirname, '..', 'data', 'requests.json');
const userFilePath = path.join(__dirname, '..', 'data', 'users.json');

router.post('/', (req, res) => {
  const { groupID } = req.body;

  fs.readFile(requestFilePath, 'utf8', (err, requestData) => {
    if (err) {
      console.error('Error reading requests data:', err);
      return res.sendStatus(500);
    }

    // Parse and instantiate Request objects
    const requests = JSON.parse(requestData)
      .map(req => new Request(req.requestID, req.groupID, req.userID))
      .filter(req => req.groupID === groupID);

    fs.readFile(userFilePath, 'utf8', (err, userData) => {
      if (err) {
        console.error('Error reading user data:', err);
        return res.sendStatus(500);
      }

      // Parse and instantiate User objects
      const users = JSON.parse(userData)
        .map(user => new User(user.userID, user.username, user.email, user.password, user.role));
      
      // Combine requests and user data
      const userRequests = requests.map(request => {
        const user = users.find(user => user.userID === request.userID);
        return { requestID: request.requestID, userID: user.userID, username: user.username };
      });

      res.json(userRequests);
    });
  });
});

module.exports = router;
