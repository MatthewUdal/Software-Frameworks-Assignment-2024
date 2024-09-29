const Chat = require('./models/Chat');

function initializeSockets(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinChannel', ({ channelID }) => {
      socket.join(channelID);
      console.log(`User joined channel: ${channelID}`);
    });

    socket.on('sendMessage', async ({ channelID, userID, message }) => {
      try {

        const newChat = new Chat({ channelID, userID, message });
        await newChat.save();

        const populatedChat = await Chat.findById(newChat._id)
          .populate('userID', 'username role profilePicture');

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
      console.log('User disconnected');
    });
  });
}

module.exports = initializeSockets;
