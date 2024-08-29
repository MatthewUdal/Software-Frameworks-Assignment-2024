class Channel {
  constructor(channelID, groupID, name, members = []) {
      this.channelID = channelID;
      this.groupID = groupID;
      this.name = name;
      this.members = members;
  }
}

module.exports = Channel;
