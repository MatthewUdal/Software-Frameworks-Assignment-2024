const Chat = require('./models/chat');

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
        io.to(channelID).emit('newMessage', newChat);
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
