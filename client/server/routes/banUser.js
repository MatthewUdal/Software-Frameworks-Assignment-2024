const express = require('express');
const router = express.Router();
const GroupService = require('../models/GroupService');
const ReportService = require('../models/ReportService');
const UserService = require('../models/UserService');

// route to remove a user from a group and add their userID to the blacklist
router.post('/', async (req, res) => {
    const { userID, groupID } = req.body;

    try {
        let groups = await GroupService.readGroups();
        let users = await UserService.readUsers();

        const group = groups.find(group => group.groupID === groupID);
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        const user = users.find(user => user.userID === userID);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'superAdmin') {
            return res.status(403).json({ success: false, message: 'Cannot ban or report a superAdmin' });
        }


        group.memberIDs = group.memberIDs.filter(id => id !== userID);
        if (!group.blacklistedIDs.includes(userID)) {
            group.blacklistedIDs.push(userID);
        }

        await GroupService.writeGroups(groups);

        let reports = await ReportService.readReports();
        const newReportID = reports.length ? reports[reports.length - 1].reportID + 1 : 1;
        const newReport = { reportID: newReportID, userID };

        reports.push(newReport);
        await ReportService.writeReports(reports);

        res.json({ success: true, message: 'User banned and reported successfully' });

    } catch (err) {
        console.error('Error banning user:', err);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

module.exports = router;
