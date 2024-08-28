const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const GroupService = require('../models/GroupService');
const UserService = require('../models/UserService');
const RequestService = require('../models/RequestService');
const ChannelService = require('../models/ChannelService');

router.post('/', async (req, res) => {
    const { userID } = req.body;

    try {
        const groups = await GroupService.readGroups();
        const users = await UserService.readUsers();

        const foundUser = users.find(user => user.userID === userID);

        if (!foundUser) {
            return res.sendStatus(404);
        }

        if (foundUser.role === 'superAdmin') {
            return res.json(groups);
        }

        const filteredGroups = groups.filter(group => group.memberIDs.includes(userID));
        res.json(filteredGroups);
    } catch (err) {
        console.error('Error:', err);
        res.sendStatus(500);
    }
});

router.post('/createGroup', async (req, res) => {
    try {
        const groups = await GroupService.readGroups();

        const newGroupID = groups.length ? Math.max(...groups.map(group => group.groupID)) + 1 : 1;
        const { userID, groupName } = req.body;

        if (!userID || !groupName) {
            return res.status(400).json({ error: 'UserID and groupName are required.' });
        }

        const newGroup = new Group(newGroupID, [userID], groupName, [userID], []);
        groups.push(newGroup);

        await GroupService.writeGroups(groups);
        res.status(201).json(newGroup);
    } catch (err) {
        console.error('Error:', err);
        res.sendStatus(500);
    }
});

router.post('/leaveGroup', async (req, res) => {
    const { groupID, userID } = req.body;

    try {
        const users = await UserService.readUsers();
        const foundUser = users.find(user => user.userID === userID);

        if (!foundUser) {
            return res.sendStatus(404);
        }

        if (foundUser.role === 'superAdmin') {
            return res.status(400).json({ message: 'super admin cannot leave a group' });
        }

        const groups = await GroupService.readGroups();
        const groupIndex = groups.findIndex(group => group.groupID === groupID);

        if (groupIndex === -1) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const memberIndex = groups[groupIndex].memberIDs.indexOf(userID);
        if (memberIndex > -1) {
            groups[groupIndex].memberIDs.splice(memberIndex, 1);
            await GroupService.writeGroups(groups);
            res.status(200).json({ message: 'User removed from group' });
        } else {
            res.status(400).json({ message: 'User is not a member of the group' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.sendStatus(500);
    }
});

router.post('/deleteGroup', async (req, res) => {
    const { groupID } = req.body;

    try {
        const groups = await GroupService.readGroups();
        const channels = await ChannelService.readChannels();
        const requests = await RequestService.readRequests();

        const updatedGroups = groups.filter(group => group.groupID !== groupID);
        const updatedChannels = channels.filter(channel => channel.groupID !== groupID);
        const updatedRequests = requests.filter(request => request.groupID !== groupID);

        await GroupService.writeGroups(updatedGroups);
        await ChannelService.writeChannels(updatedChannels);
        await RequestService.writeRequests(updatedRequests);

        res.status(200).json({ message: 'Deleted all data related to the groupID' });
    } catch (err) {
        console.error('Error:', err);
        res.sendStatus(500);
    }
});

router.post('/getMembers', async (req, res) => {
    const { groupID } = req.body;

    if (!groupID) {
        return res.status(400).json({ error: 'groupID is required' });
    }

    try {
        const groups = await GroupService.readGroups();
        const group = groups.find(group => group.groupID === groupID);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const users = await UserService.readUsers();
        const members = group.memberIDs.map(memberID => {
            const user = users.find(user => user.userID === memberID);
            return {
                userID: user.userID,
                username: user.username,
                role: user.role
            };
        });

        res.status(200).json(members);
    } catch (err) {
        console.error('Error:', err);
        res.sendStatus(500);
    }
});


router.post('/kickUser', async (req, res) => {
  const { groupID, userID } = req.body;

  try {
      const users = await UserService.readUsers();
      const user = users.find(u => u.userID === userID);

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (user.role === 'superAdmin' || user.role === 'groupAdmin') {
          return res.status(403).json({ success: false, message: 'Cannot kick a superAdmin or groupAdmin' });
      }

      const groups = await GroupService.readGroups();
      const group = groups.find(g => g.groupID === groupID);

      if (!group) {
          return res.status(404).json({ success: false, message: 'Group not found' });
      }

      const memberIndex = group.memberIDs.indexOf(userID);
      const adminIndex = group.adminIDs.indexOf(userID);

      if (memberIndex !== -1) {
          group.memberIDs.splice(memberIndex, 1);
      }

      if (adminIndex !== -1) {
          group.adminIDs.splice(adminIndex, 1);
      }

      await GroupService.writeGroups(groups);

      res.json({ success: true, message: 'User kicked from the group successfully' });
  } catch (err) {
      console.error('Error:', err);
      res.sendStatus(500);
  }
});

module.exports = router;

module.exports = router;
