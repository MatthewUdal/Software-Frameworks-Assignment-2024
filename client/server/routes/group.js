const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');

const groupFilePath = path.join(__dirname, '..', 'data', 'groups.json');
const userFilePath = path.join(__dirname, '..', 'data', 'users.json');
const requestFilePath = path.join(__dirname, '..', 'data', 'requests.json');
const channelFilePath = path.join(__dirname, '..', 'data', 'channels.json');

router.post('/', (req, res) => {
    const { userID } = req.body;

    // Read the groups data
    fs.readFile(groupFilePath, 'utf8', (err, groupData) => {
        if (err) {
            console.error('Error reading group data:', err);
            return res.sendStatus(500);
        }

        let groups = JSON.parse(groupData).map(group => new Group(group.groupID, group.memberIDs, group.name, group.adminIDs));

        // Read the users data
        fs.readFile(userFilePath, 'utf8', (err, userData) => {
            if (err) {
                console.error('Error reading user data:', err);
                return res.sendStatus(500);
            }

            let users = JSON.parse(userData).map(user => new User(user.userID, user.username, user.email, user.password, user.role));
            const foundUser = users.find(user => user.userID === userID);

            if (!foundUser) {
                return res.sendStatus(404);
            }

            if (foundUser.role === 'superAdmin') {
                // Super Admin: Return all groups
                return res.json(groups);
            }

            // Regular user or other roles: Filter groups based on membership
            groups = groups.filter(group => group.memberIDs.includes(userID));
            res.json(groups);
        });
    });
});

router.post('/createGroup', (req, res) => {
  fs.readFile(groupFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading group data:', err);
      return res.sendStatus(500);
    }

    const groups = JSON.parse(data).map(group => new Group(group.groupID, group.memberIDs, group.name, group.adminIDs));

    const newGroupID = groups.length ? Math.max(...groups.map(group => group.groupID)) + 1 : 1;

    const { userID, groupName } = req.body;

    if (!userID || !groupName) {
        return res.status(400).json({ error: 'UserID and groupName are required.' });
    }

    const newGroup = new Group(newGroupID, [userID], groupName, [userID]);

    groups.push(newGroup);

    fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), (err) => {
      if (err) {
        console.error('Error writing group data:', err);
        return res.sendStatus(500);
      }

      res.status(201).json(newGroup);
    });
  });
});


router.post('/leaveGroup', (req, res) => {
    const { groupID, userID } = req.body;

    fs.readFile(userFilePath, 'utf8', (err, userData) => {
        if (err) {
            console.error('Error reading user data:', err);
            return res.sendStatus(500);
        }

        let users = JSON.parse(userData).map(user => new User(user.userID, user.username, user.email, user.password, user.role));
        const foundUser = users.find(user => user.userID === userID);

        if (!foundUser) {
            return res.sendStatus(404);
        }

        if (foundUser.role === 'superAdmin') {
            return res.status(400).json({ message: 'super admin cannot leave a group' });
        } else {
            fs.readFile(groupFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading group data:', err);
                    return res.sendStatus(500);
                }
        
                let groups = JSON.parse(data);
                const groupIndex = groups.findIndex(group => group.groupID === groupID);
        
                if (groupIndex === -1) {
                    return res.status(404).json({ message: 'Group not found' });
                }
        
                // Remove userID from memberIDs
                const memberIndex = groups[groupIndex].memberIDs.indexOf(userID);
                if (memberIndex > -1) {
                    groups[groupIndex].memberIDs.splice(memberIndex, 1);
        
                    fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), (err) => {
                        if (err) {
                            console.error('Error writing group data:', err);
                            return res.sendStatus(500);
                        }
        
                    res.status(200).json({ message: 'User removed from group' });
                });
                } else {
                    res.status(400).json({ message: 'User is not a member of the group' });
                }
            });
        }});
    })

router.post('/deleteGroup', (req, res) => {
    const { groupID } = req.body;

    // Read them all together isntead of a ton of read and writes
    const groups = JSON.parse(fs.readFileSync(groupFilePath));
    const channels = JSON.parse(fs.readFileSync(channelFilePath));
    const requests = JSON.parse(fs.readFileSync(requestFilePath));

    // Use the cool method of removing data from above
    const updatedGroups = groups.filter(group => group.groupID !== groupID);
    const updatedChannels = channels.filter(channel => channel.groupID !== groupID);
    const updatedRequests = requests.filter(request => request.groupID !== groupID);

    // Write the updated data back to the files
    fs.writeFileSync(groupFilePath, JSON.stringify(updatedGroups, null, 2));
    fs.writeFileSync(channelFilePath, JSON.stringify(updatedChannels, null, 2));
    fs.writeFileSync(requestFilePath, JSON.stringify(updatedRequests, null, 2));

    res.status(200).json({ message: 'Deleted all data related to the groupID' });
});

router.post('/getMembers', (req, res) => {
  const { groupID } = req.body;

  if (!groupID) {
    return res.status(400).json({ error: 'groupID is required' });
  }

  fs.readFile(groupFilePath, 'utf8', (err, groupsData) => {
    if (err) {
      console.error('Error reading groups data:', err);
      return res.sendStatus(500);
    }

    const groups = JSON.parse(groupsData);
    const group = groups.find(group => group.groupID === groupID);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    fs.readFile(userFilePath, 'utf8', (err, usersData) => {
      if (err) {
        console.error('Error reading users data:', err);
        return res.sendStatus(500);
      }

      const users = JSON.parse(usersData);
      const members = group.memberIDs.map(memberID => {
        const user = users.find(user => user.userID === memberID);
        return {
          userID: user.userID,
          username: user.username,
          role: user.role
        };
      });
  
        res.status(200).json(members);
      });
    });
  });

  router.post('/kickUser', (req, res) => {
    const { groupID, userID } = req.body;
  
    fs.readFile(userFilePath, 'utf8', (err, userData) => {
      if (err) {
        console.error('Error reading user data:', err);
        return res.sendStatus(500);
      }
  
      let users = JSON.parse(userData);
      const user = users.find(u => u.userID === userID);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      if (user.role === 'superAdmin' || user.role === 'groupAdmin') {
        return res.status(403).json({ success: false, message: 'Cannot kick a superAdmin' });
      }
  
      fs.readFile(groupFilePath, 'utf8', (err, groupData) => {
        if (err) {
          console.error('Error reading group data:', err);
          return res.sendStatus(500);
        }
  
        let groups = JSON.parse(groupData);
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
  
        fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Error writing group data:', err);
            return res.sendStatus(500);
          }
  
          res.json({ success: true, message: 'User kicked from the group successfully' });
        });
      });
    });
  });

module.exports = router;
