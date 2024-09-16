const Request = require('../models/Request');

class RequestService {

    // Fetch all requests by user ID
    static async getRequestsByUserID(userID) {
        try {
            return await Request.find({ userID }).exec();
        } catch (err) {
            throw new Error(`Error reading requests: ${err.message}`);
        }
    }

    // Find a request by user ID and group ID
    static async findRequest(userID, groupID) {
        try {
            return await Request.findOne({ userID, groupID }).exec();
        } catch (err) {
            throw new Error(`Error finding request: ${err.message}`);
        }
    }

    // Create a new request
    static async createRequest(userID, groupID) {
        try {
            const newRequest = new Request({
                groupID,
                userID
            });
            return await newRequest.save();
        } catch (err) {
            throw new Error(`Error creating request: ${err.message}`);
        }
    }

    // Delete a request by request ID
    static async deleteRequest(requestID) {
        try {
            return await Request.findByIdAndDelete(requestID).exec();
        } catch (err) {
            throw new Error(`Error deleting request: ${err.message}`);
        }
    }

    // Delete all requests by group ID
    static async deleteRequestsByGroupID(groupID) {
        try {
            const result = await Request.deleteMany({ groupID }).exec();
            return result;
        } catch (err) {
            throw new Error(`Error deleting requests by group ID: ${err.message}`);
        }
    }
}

module.exports = RequestService;
