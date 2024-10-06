const { expect } = require('chai');
const express = require('express');
const https = require('https');
const fs = require('fs');
const { ExpressPeerServer } = require('peer');

describe('Peer Server Initialization', () => {
  let server, peerServer;
  const PORT = 3001;

  const sslOptions = {
    key: fs.readFileSync('./key.pem'), 
    cert: fs.readFileSync('./cert.pem'),
  };

  before((done) => {
    const app = express();
    
    peerServer = ExpressPeerServer(app, { path: '/videocall' });
    app.use('/videocall', peerServer);

    server = https.createServer(sslOptions, app);
    
    server.listen(PORT, () => {
      console.log(`Peer server is running on port ${PORT}`);
      done();
    });
  });

  it('should initialize the server correctly', () => {
    expect(server).to.exist;
  });

  it('should listen on the correct port', () => {
    expect(server.listening).to.be.true; 
  });

  it('should have a configured Peer server', () => {
    expect(peerServer).to.exist; 
    expect(peerServer).to.be.a('function');
  });

  after((done) => {
    server.close(() => {
      console.log('Peer server closed');
      done();
    });
  });
});
