const fs = require('fs');
const path = require('path');
const Group = require('../models/Group');

const groupFilePath = path.join(__dirname, '..', 'data', 'groups.json');

class GroupService {
    static readGroups() {
        return new Promise((resolve, reject) => {
            fs.readFile(groupFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const groups = JSON.parse(data).map(group => new Group(group.groupID, group.memberIDs, group.name, group.adminIDs, group.blacklistedIDs));
                resolve(groups);
            });
        });
    }

    static writeGroups(groups) {
        return new Promise((resolve, reject) => {
            fs.writeFile(groupFilePath, JSON.stringify(groups, null, 2), 'utf8', (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = GroupService;
