const express = require("express");
const connectDB = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  }
});


require('./sockets')(io);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname + './dist/software-frameworks-assignment-2024'));

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

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
