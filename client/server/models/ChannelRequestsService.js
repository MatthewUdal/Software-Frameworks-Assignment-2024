const ChannelRequest = require('../models/ChannelRequest');

class ChannelRequestService {
    // Method to get all channel requests
    static async readRequests() {
        try {
            return await ChannelRequest.find();
        } catch (error) {
            throw new Error('Error reading requests from database');
        }
    }

    // Method to create a new channel request
    static async createRequest(userID, channelID, groupID) {
        try {
            const newRequest = new ChannelRequest({ userID, channelID, groupID });
            await newRequest.save();
            return newRequest._id;
        } catch (error) {
            throw new Error('Error creating new request');
        }
    }

    // Method to delete a channel request
    static async deleteRequest(requestID) {
        try {
            await ChannelRequest.findByIdAndDelete(requestID);
        } catch (error) {
            throw new Error('Error deleting request');
        }
    }

    // Delete channel requests by channel ID
    static async deleteChannelRequestsByChannelID(channelID) {
        try {
            const result = await ChannelRequest.deleteMany({ channelID }).exec();
            return result;
        } catch (err) {
            throw new Error(`Error deleting channel requests by channel ID: ${err.message}`);
        }
    }

}

module.exports = ChannelRequestService;
