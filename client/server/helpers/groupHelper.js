const Group = require('../models/Group');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

class GroupHelper {
    
    // Create a new group
    static async createGroup(groupName, userID) {
        try {
            const newGroup = new Group({
                name: groupName,
                memberIDs: [new ObjectId(userID)],
                adminIDs: [new ObjectId(userID)],
                blacklistedIDs: []
            });

            return await newGroup.save();
        } catch (err) {
            throw new Error(`Error creating group: ${err.message}`);
        }
    }

    // delete a group
    static async deleteGroup(groupID) {
        try {
            const result = await Group.findByIdAndDelete(groupID).exec();
            if (!result) throw new Error('Group not found');
            return result;
        } catch (err) {
            throw new Error(`Error deleting group: ${err.message}`);
        }
    }

}

module.exports = GroupHelper;