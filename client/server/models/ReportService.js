const fs = require('fs');
const path = require('path');
const Report = require('../models/Report');
const reportFilePath = path.join(__dirname, '..', 'data', 'reports.json');

class ReportService {
    // method used to read all reports and return an array of report instances
    static readReports() {
        return new Promise((resolve, reject) => {
            fs.readFile(reportFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const reports = JSON.parse(data).map(report => new Report(report.reportID, report.userID));
                resolve(reports);
            });
        });
    }

    // method used to write an instance of report
    static writeReports(reports) {
        return new Promise((resolve, reject) => {
            fs.writeFile(reportFilePath, JSON.stringify(reports, null, 2), 'utf8', (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = ReportService;
