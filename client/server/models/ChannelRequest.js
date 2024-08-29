class RequestChannel {
    constructor(channelRequestID, groupID, channelID, userID) {
        this.channelRequestID= channelRequestID;
        this.groupID = groupID;
        this.channelID= channelID;
        this.userID = userID;
    }    
}

module.exports = RequestChannel;