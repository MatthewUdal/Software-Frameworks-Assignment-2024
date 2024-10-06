const { expect } = require('chai');
const { Server } = require('socket.io');
const { createServer } = require('http');
const ioClient = require('socket.io-client');
const initialiseSockets = require('../sockets');

describe('Socket Server Connection', () => {
  let io, httpServer, clientSocket;

  before((done) => {
    // Create a new HTTP server and initialize a socket server
    httpServer = createServer();
    io = new Server(httpServer);
    initialiseSockets(io);
    
    httpServer.listen(() => {
      const port = httpServer.address().port;

      clientSocket = ioClient.connect(`http://localhost:${port}`, {
        reconnectionDelay: 0,
        forceNew: true,
        transports: ['websocket'],
      });

      clientSocket.on('connect', done);
    });
  });

  it('Should have a client connect to the socket', (done) => {
    expect(clientSocket.connected).to.be.true;
    done();
  });

  after((done) => {
    clientSocket.disconnect();
    io.close();
    done();
  });
});
