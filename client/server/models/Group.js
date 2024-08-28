class Group {
    constructor(groupID, memberIDs, name, adminIDs, blacklistedIDs) {
      this.groupID = groupID;
      this.memberIDs = memberIDs;
      this.name = name;
      this.adminIDs = adminIDs;
      this.blacklistedIDs = blacklistedIDs;
    }
  }
  
  module.exports = Group;