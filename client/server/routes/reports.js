const express = require('express');
const router = express.Router();
const ReportService = require('../models/ReportService');
const UserService = require('../models/UserService');

// Route to get all reports
router.get('/', async (req, res) => {
    try {
        const reports = await ReportService.readReports();
        const users = await UserService.readUsers();

        const reportWithUsernames = reports.map(report => {
            const user = users.find(user => user._id.toString() === report.userID.toString());
            return {
                _id: report._id,
                userID: report.userID,
                name: user ? user.username : 'Unknown User'
            };
        });

        res.json(reportWithUsernames);
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.sendStatus(500);
    }
});

// Route to delete a report
router.post('/ignore', async (req, res) => {
    try {
        const { reportID } = req.body;

        await ReportService.deleteReport(reportID);

        res.json({ success: true, message: `Report with ID ${reportID} deleted` });
    } catch (err) {
        console.error('Error deleting report:', err);
        res.sendStatus(500);
    }
});

module.exports = router;
