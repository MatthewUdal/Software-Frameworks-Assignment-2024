const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Channel = require('../models/Channel');

const filePath = path.join(__dirname, '..', 'data', 'channels.json');

router.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading channel data:', err);
      return res.sendStatus(500);
    }

    const channels = JSON.parse(data).map(channel => new Channel(channel.channelID, channel.groupID, channel.name));
    res.json(channels);
  });
});

// router.post('/', (req, res) => {
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading channel data:', err);
//       return res.sendStatus(500);
//     }

//     const channels = JSON.parse(data).map(channel => new Channel(channel.channelID, channel.groupID, channel.name));

//     const newChannelID = channels.length ? Math.max(...channels.map(channel => channel.channelID)) + 1 : 1;
//     const newChannel = new Channel(newChannelID, req.body.groupID, req.body.name);

//     channels.push(newChannel);

//     fs.writeFile(filePath, JSON.stringify(channels, null, 2), (err) => {
//       if (err) {
//         console.error('Error writing channel data:', err);
//         return res.sendStatus(500);
//       }

//       res.status(201).json(newChannel);
//     });
//   });
// });

module.exports = router;
