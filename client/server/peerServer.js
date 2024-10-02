const { PeerServer } = require('peer');

function videoCall(server, PORT1, sslOptions) {
    const videoCallServer = PeerServer(server, {
        port: PORT1,
        path: '/videocall',
        ssl: sslOptions
      });

      return videoCallServer;
}

module.exports = { videoCall };
