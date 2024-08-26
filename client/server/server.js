const express = require("express");
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + './dist/software-frameworks-assignment-2024'));


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

const permsRoute = require('./routes/perms');
app.use('/perms', permsRoute);

const getReqRoute = require('./routes/getRequests');
app.use('/getRequests', getReqRoute);

const approveRequest = require('./routes/approveRequest');
app.use('/approveRequest', approveRequest);

const declineRequest = require('./routes/declineRequest');
app.use('/declineRequest', declineRequest);

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
