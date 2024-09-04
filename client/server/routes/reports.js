const express = require('express');
const router = express.Router();
const ReportService = require('../models/ReportService');
const UserService = require('../models/UserService');

// route to get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await ReportService.readReports();
    const users = await UserService.readUsers();

    const reportWithUsernames = reports.map(report => {
      const user = users.find(user => user.userID === report.userID);
      return {
        reportID: report.reportID,
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

// route to delete a report
router.post('/ignore', async (req, res) => {
  try {
    const { reportID } = req.body;
    const reports = await ReportService.readReports();

    filteredReports = reports.filter(report => report.reportID !== reportID);

    await ReportService.writeReports(filteredReports);

    res.json(reportID);
  } catch (err) {
    console.error('Error deleting reports:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
