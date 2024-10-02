import { Injectable } from '@angular/core';
import Peer, { DataConnection, MediaConnection } from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class PeerServiceService {
  private peer: Peer | null = null;
  private mediaConnection: MediaConnection | null = null;
  private PORT1 = 3001;

  constructor() { }

  // Initialize the PeerJS client and connect to the server
  initPeer(userId: string) {
    this.peer = new Peer(userId, {
      host: 'http://s5394035.elf.ict.griffith.edu.au',
      port: this.PORT1,
      path: '/videocall',
      secure: true
    });

    return this.peer;
  }


}
