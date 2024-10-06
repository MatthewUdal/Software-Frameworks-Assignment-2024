const mongoose = require('mongoose');
const Channel = require('../models/Channel');
const { ObjectId } = mongoose.Types;

class ChannelHelper {

    // Add a new channel
    static async addChannel(groupID, name, userID) {
        try {
            const newChannel = new Channel({
                groupID: new ObjectId(groupID), 
                name,
                members: [new ObjectId(userID)]
            });
    
            const savedChannel = await newChannel.save();
            return savedChannel;
        } catch (err) {
            throw new Error(`Error adding channel: ${err.message}`);
        }
    }

    static async deleteChannel(channelID) {
        try {
            const result = await Channel.deleteOne({ _id: channelID });

            // Check if any channel was deleted
            if (result.deletedCount === 0) {
                throw new Error('Channel not found');
            }

            return result;
        } catch (err) {
            throw new Error(`Error deleting channel: ${err.message}`);
        }
    }


    
}

module.exports = ChannelHelper;
