const Report = require('../models/Report');

class ReportService {
    // Method to read all reports from MongoDB
    static async readReports() {
        try {
            // Fetch all reports from MongoDB
            return await Report.find().exec();
        } catch (err) {
            throw new Error(`Error reading reports: ${err.message}`);
        }
    }

    // Method to delete a report by ID
    static async deleteReport(reportID) {
        try {
            // Delete report by its reportID
            const result = await Report.findByIdAndDelete(reportID).exec();
            if (!result) throw new Error('Report not found');
            return result;
        } catch (err) {
            throw new Error(`Error deleting report: ${err.message}`);
        }
    }
}

module.exports = ReportService;
