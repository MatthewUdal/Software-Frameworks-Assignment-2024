const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');

const groupFilePath = path.join(__dirname, '..', 'data', 'groups.json');
const userFilePath = path.join(__dirname, '..', 'data', 'users.json');

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

// router.post('/', (req, res) => {
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading group data:', err);
//       return res.sendStatus(500);
//     }

//     const groups = JSON.parse(data).map(group => new Group(group.groupID, group.memberIDs, group.name));

//     const newGroupID = groups.length ? Math.max(...groups.map(group => group.groupID)) + 1 : 1;
//     const newGroup = new Group(newGroupID, req.body.memberIDs, req.body.name);

//     groups.push(newGroup);

//     fs.writeFile(filePath, JSON.stringify(groups, null, 2), (err) => {
//       if (err) {
//         console.error('Error writing group data:', err);
//         return res.sendStatus(500);
//       }

//       res.status(201).json(newGroup);
//     });
//   });
// });


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



module.exports = router;
