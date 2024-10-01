const Chat = require('./models/Chat');

function initializeSockets(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    let currentChannelID = null;
    let currentUsername = null;

    socket.on('joinChannel', async ({ channelID, userID, username }) => {
      // Leave the previous channel if the user is already in one
      if (currentChannelID) {
        socket.leave(currentChannelID); 

        // Emit a message to notify others in the previous channel that the user has left
        const leaveMessage = `${currentUsername} has left the channel.`;
        io.to(currentChannelID).emit('newMessage', {
          chatID: null, // null for system messages
          channelID: currentChannelID,
          userID: null, // null for system messages
          username: 'System',
          role: 'system',
          profilePicture: '',
          message: leaveMessage,
          timestamp: new Date()
        });
        console.log(`User ${currentUsername} disconnected from channel ${currentChannelID}`);
      }

      // Join the new channel
      socket.join(channelID);
      currentChannelID = channelID;
      currentUsername = username; 
      console.log(`User joined channel: ${channelID}`);

      // Emit a message to notify others in the new channel that a user has joined
      const joinMessage = `${username} has joined the channel.`;
      io.to(channelID).emit('newMessage', {
        chatID: null, // null for system messages
        channelID,
        userID: null, // null for system messages
        username: 'System',
        role: 'system',
        profilePicture: '',
        message: joinMessage,
        timestamp: new Date()
      });
    });

    socket.on('sendMessage', async ({ channelID, userID, message }) => {
      try {
        const newChat = new Chat({ channelID, userID, message });
        await newChat.save();

        // Populate user data for the chat message
        const populatedChat = await Chat.findById(newChat._id).populate('userID', 'username role profilePicture');

        // Map the message to the format expected by the frontend
        const mappedMessage = {
          chatID: populatedChat._id,
          channelID: populatedChat.channelID,
          userID: populatedChat.userID._id,
          username: populatedChat.userID.username,
          role: populatedChat.userID.role,
          profilePicture: populatedChat.userID.profilePicture,
          message: populatedChat.message,
          timestamp: newChat.timestamp
        };

        io.to(channelID).emit('newMessage', mappedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      // user dc from site and therefore the channel
      if (currentChannelID && currentUsername) {
        const leaveMessage = `${currentUsername} has left the channel.`;
        io.to(currentChannelID).emit('newMessage', {
          chatID: null, // null for system messages
          channelID: currentChannelID,
          userID: null, // null for system messages
          username: 'System',
          role: 'system',
          profilePicture: '',
          message: leaveMessage,
          timestamp: new Date()
        });
      }
      console.log(`User ${currentUsername} disconnected from channel ${currentChannelID}`);
    });
  });
}

module.exports = initializeSockets;
