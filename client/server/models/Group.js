class Group {
    constructor(groupID, memberIDs, name, adminIDs) {
      this.groupID = groupID;
      this.memberIDs = memberIDs;
      this.name = name;
      this.adminIDs = adminIDs;
    }
  }
  
  module.exports = Group;