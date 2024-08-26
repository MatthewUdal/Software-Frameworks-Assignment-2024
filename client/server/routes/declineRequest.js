const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const requestFilePath = path.join(__dirname, '..', 'data', 'requests.json');

router.post('/', (req, res) => {
  const { requestID } = req.body;

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

    // Remove the request from the array
    requests.splice(requestIndex, 1);

    fs.writeFile(requestFilePath, JSON.stringify(requests, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing requests data:', err);
        return res.sendStatus(500);
      }

      res.json({ success: true, message: 'Request removed successfully' });
    });
  });
});

module.exports = router;
