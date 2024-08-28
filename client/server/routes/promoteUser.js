const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const userFilePath = path.join(__dirname, '..', 'data', 'users.json');
const groupFilePath = path.join(__dirname, '..', 'data', 'groups.json');


router.post('/', (req, res) => {
    const { userID, newRole } = req.body;

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

        user.role = newRole;
        fs.readFile(groupFilePath, 'utf8', (err, groupData) => {
            if (err) {
                console.error('Error reading group data:', err);
                return res.sendStatus(500);
            }

            let groups = JSON.parse(groupData);
            const userGroups = groups.filter(g => g.memberIDs.includes(userID));

            userGroups.forEach(group => {
                if (!group.adminIDs.includes(userID)) {
                    group.adminIDs.push(userID);
                }
            });

            fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing group data:', err);
                    return res.sendStatus(500);
                }

                fs.writeFile(userFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing user data:', err);
                        return res.sendStatus(500);
                    }

                    res.json({ success: true, message: 'User role updated and added to admin list successfully' });
                });
            });
        });
    });
});

module.exports = router;
