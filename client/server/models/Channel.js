class Channel {
    constructor(channelID, groupID, name, blacklistedIDs) {
      this.channelID = channelID;
      this.groupID = groupID;
      this.name = name;
      this.blacklistedIDs = blacklistedIDs;
    }
  }
  module.exports = Channel;