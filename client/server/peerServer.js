const { PeerServer } = require('peer');

function videoCall(PORT1, sslOptions) {
  const videoCallServer = PeerServer({
    port: PORT1,
    path: '/videocall',
    ssl: sslOptions
  });

  return videoCallServer;
}

module.exports = { videoCall };
