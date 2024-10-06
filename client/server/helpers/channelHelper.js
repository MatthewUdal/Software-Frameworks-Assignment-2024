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


    
}

module.exports = ChannelHelper;
