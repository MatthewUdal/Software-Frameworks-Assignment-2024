import { Injectable } from '@angular/core';
import Peer, { DataConnection, MediaConnection } from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class PeerServiceService {
  private peer: Peer | null = null;
  private connections: Map<string, MediaConnection> = new Map(); // Store connections with peers
  private peerID: string = '';
  private PORT1 = 3001;

  constructor() { }

  // Initialize the PeerJS client and connect to the server
  initPeer(userId: string, channelID: string) {
    this.peer = new Peer(`${channelID}-${userId}`, {
      host: 'http://s5394035.elf.ict.griffith.edu.au',
      port: this.PORT1,
      path: '/videocall',
      secure: true,
    });
    this.peerID = `${channelID}-${userId}`;

    this.peer.on('call', (call: MediaConnection) => {
      call.answer();
      this.connections.set(call.peer, call); 

      call.on('stream', (remoteStream) => {
        this.handleRemoteStream(call.peer, remoteStream);
      });
    });

    return this.peer;
  }

  // create the channel call
  callPeer(remotePeerID: string, stream: MediaStream) {
    if (!this.peer || this.connections.has(remotePeerID)) return;

    const call = this.peer.call(remotePeerID, stream);
    this.connections.set(remotePeerID, call);

    call.on('stream', (remoteStream) => {
      this.handleRemoteStream(remotePeerID, remoteStream);
    });
  }

  // end the call
  closeCall() {
    this.connections.forEach((connection) => connection.close());
    this.connections.clear();
  }

  // function for camera/screen share
  handleRemoteStream(remotePeerID: string, remoteStream: MediaStream) {
    const videoElement = document.getElementById(`remote-video-${remotePeerID}`) as HTMLVideoElement;
    if (videoElement) {
      videoElement.srcObject = remoteStream;
      videoElement.play();
    }
  }
}
