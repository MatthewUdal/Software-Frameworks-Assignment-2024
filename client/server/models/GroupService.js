const Group = require('../models/Group');

class GroupService {
    // Fetch all groups from the database
    static async getAllGroups() {
        try {
            const groups = await Group.find().exec();
            return groups;
        } catch (err) {
            throw new Error(`Error reading groups: ${err.message}`);
        }
    }

    // Fetch all groups a user is in
    static async getGroupsByUserID(userID) {
        try {
            const groups = await Group.find({ memberIDs: userID }).exec();
            return groups;
        } catch (err) {
            throw new Error(`Error reading groups: ${err.message}`);
        }
    }

    // Create a new group
    static async createGroup(userID, groupName) {
        try {
            const newGroup = new Group({
                name: groupName,
                memberIDs: [userID],
                adminIDs: [userID],
                blacklistedIDs: []
            });

            return await newGroup.save();
        } catch (err) {
            throw new Error(`Error creating group: ${err.message}`);
        }
    }

    // Find a group by its ID
    static async findGroupByID(groupID) {
        try {
            const group = await Group.findById(groupID).exec();
            if (!group) throw new Error('Group not found');
            return group;
        } catch (err) {
            throw new Error(`Error finding group by ID: ${err.message}`);
        }
    }

    // Update a group
    static async updateGroup(groupID, updateFields) {
        try {
            const group = await Group.findByIdAndUpdate(groupID, updateFields, { new: true }).exec();
            if (!group) throw new Error('Group not found');
            return group;
        } catch (err) {
            throw new Error(`Error updating group: ${err.message}`);
        }
    }

    // Delete a group by its ID
    static async deleteGroup(groupID) {
        try {
            const result = await Group.findByIdAndDelete(groupID).exec();
            if (!result) throw new Error('Group not found');
            return result;
        } catch (err) {
            throw new Error(`Error deleting group: ${err.message}`);
        }
    }

    // Add a member to a group
    static async addMember(groupID, userID) {
        try {
            const group = await Group.findById(groupID).exec();
            if (!group) throw new Error('Group not found');

            if (!group.memberIDs.includes(userID)) {
                group.memberIDs.push(userID);
                await group.save();
            }

            return group;
        } catch (err) {
            throw new Error(`Error adding member to group: ${err.message}`);
        }
    }

    // Remove a member from a group
    static async removeMember(groupID, userID) {
        try {
            const group = await Group.findById(groupID).exec();
            if (!group) throw new Error('Group not found');

            group.memberIDs = group.memberIDs.filter(memberID => memberID.toString() !== userID.toString());
            await group.save();

            return group;
        } catch (err) {
            throw new Error(`Error removing member from group: ${err.message}`);
        }
    }

    // Fetch members of a group
    static async getMembers(groupID) {
        try {
            const group = await Group.findById(groupID).populate('memberIDs', 'username role').exec();
            if (!group) throw new Error('Group not found');
            return group.memberIDs; 
        } catch (err) {
            throw new Error(`Error getting group members: ${err.message}`);
        }
    }
}

module.exports = GroupService;
