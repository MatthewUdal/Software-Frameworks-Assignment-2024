const express = require("express");
const connectDB = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');
const fs = require('fs');


const sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


const app = express();

const PORT0 = 3000;
const PORT1 = 3001;


const server = https.createServer(sslOptions, app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});

// chat system
sockets = require('./sockets');
sockets(io);

// video call system
const { videoCall } = require('./peerServer');
const peerServer = videoCall(server, PORT1, sslOptions);
app.use('/videocall', peerServer);
console.log('Starting SSL PeerServer at: ' + PORT1);


app.use(cors());
app.use(express.json());


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist', 'software-frameworks-assignment-2024')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/profilePictures', express.static(path.join(__dirname, 'profilePictures')));

// Connect to the database
connectDB();

// Import and set up routes
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

const signupRoute = require('./routes/signup');
app.use('/signup', signupRoute);

const groupRoute = require('./routes/group');
app.use('/groups', groupRoute);

const channelRoute = require('./routes/channel');
app.use('/channels', channelRoute);

const exploreRoute = require('./routes/explore');
app.use('/explore', exploreRoute);

const channelExploreRoute = require('./routes/channel-explore');
app.use('/channelExplore', channelExploreRoute);

const permsRoute = require('./routes/perms');
app.use('/perms', permsRoute);

const requestsRoute = require('./routes/requests');
app.use('/requests', requestsRoute);

const channelRequestsRoute = require('./routes/channelRequests');
app.use('/channelRequests', channelRequestsRoute);

const promoteRoute = require('./routes/promoteUser');
app.use('/promoteUser', promoteRoute);

const banRoute = require('./routes/banUser');
app.use('/banUser', banRoute);

const reportsRoute = require('./routes/reports');
app.use('/reports', reportsRoute);

const deleteUserRoute = require('./routes/deleteUser');
app.use('/deleteUser', deleteUserRoute);

const authCheckRoute = require('./routes/authCheck');
app.use('/authCheck', authCheckRoute);

const chatRoute = require('./routes/chat');
app.use('/chat', chatRoute);

const handleUserRoute = require('./routes/handleUser');
app.use('/handleUser', handleUserRoute);



// Start the server
server.listen(PORT0, () => {
  console.log(`Server listening on port: 3000`);
});
