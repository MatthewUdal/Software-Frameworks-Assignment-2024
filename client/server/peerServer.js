const { ExpressPeerServer } = require('peer');
const express = require("express");
const https = require('https');



function videoCall(PORT1, sslOptions) {
  const app = express();
  const server = https.createServer(sslOptions, app);
  const peerServer = ExpressPeerServer(server, {
    port: PORT1,
    path: '/videocall',
    allow_discovery: true,
    debug: true,
    ssl: sslOptions
  });

  peerServer.on('connection', (client) => {
    console.log(`Peer connected with id: ${client.getId()}`);
  });

  peerServer.on('disconnect', (client) => {
    console.log(`Peer disconnected with id: ${client.getId()}`);
  });

  return peerServer;
}

module.exports = { videoCall };
