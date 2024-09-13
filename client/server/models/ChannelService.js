const mongoose = require('mongoose');
const Channel = require('../models/Channel');
const { ObjectId } = mongoose.Types;

class ChannelService {
    // Get all channels
    static async getAllChannels() {
        try {
            const channels = await Channel.find().exec();
            return channels;
        } catch (err) {
            throw new Error(`Error reading channels: ${err.message}`);
        }
    }

    // Get channels a user is a member of
    static async getUserChannels(userID) {
        try {
            const channels = await Channel.find({ members: userID }).exec();
            return channels;
        } catch (err) {
            throw new Error(`Error finding channels for user: ${err.message}`);
        }
    }

    // Add a new channel
    static async addChannel(groupID, name, userID) {
        try {
            const newChannel = new Channel({
                groupID: new mongoose.Types.ObjectId(groupID), 
                name,
                members: [new mongoose.Types.ObjectId(userID)]
            });
    
            const savedChannel = await newChannel.save();
            return savedChannel;
        } catch (err) {
            throw new Error(`Error adding channel: ${err.message}`);
        }
    }

    

    // Delete a channel
    static async deleteChannel(channelID) {
        try {
            await Channel.findByIdAndDelete(channelID).exec();
            return { message: 'Channel deleted successfully' };
        } catch (err) {
            throw new Error(`Error deleting channel: ${err.message}`);
        }
    }
}

module.exports = ChannelService;
