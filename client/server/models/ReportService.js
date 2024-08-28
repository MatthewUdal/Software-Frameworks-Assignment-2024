const fs = require('fs');
const path = require('path');
const reportFilePath = path.join(__dirname, '..', 'data', 'reports.json');

class ReportService {
    static readReports() {
        return new Promise((resolve, reject) => {
            fs.readFile(reportFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const reports = JSON.parse(data);
                resolve(reports);
            });
        });
    }

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
