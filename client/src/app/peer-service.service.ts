import { Injectable } from '@angular/core';
import Peer, { MediaConnection } from 'peerjs';
import { io, Socket } from 'socket.io-client';
import { SocketService } from './socket-service.service';

@Injectable({
  providedIn: 'root'
})
export class PeerServiceService {
  private peer!: Peer;
  public peerId: string | undefined;
  private currentCall!: MediaConnection;
  private localStream!: MediaStream;
  private screenStream!: MediaStream | null;
  private streamPeerMap: Map<string, MediaStream> = new Map();

  constructor(private socketService: SocketService) {}

  // Initialize PeerJS instance
  initPeer(roomId: string): string | undefined {
    this.peer = new Peer();

    this.peer.on('open', (id: string) => {
      console.log(`Peer connection established with ID: ${id}`);
      this.peerId = id;

      // Emit a 'join-room' event through the existing socket
      this.socketService.getSocket().emit('join-room', roomId, id);
    });

    return this.peerId;
  }

  // Store the stream with the associated peer ID
  setStreamForPeer(peerId: string, stream: MediaStream): void {
    this.streamPeerMap.set(peerId, stream);
  }

  getStreamByPeerId(peerId: string): MediaStream | undefined {
    return this.streamPeerMap.get(peerId);
  }

  // Remove the stream when a peer leaves
  removeStreamForPeer(peerId: string): void {
    this.streamPeerMap.delete(peerId);
  }
  
  onPeerOpen(callback: (id: string) => void): void {
    this.peer.on('open', callback);
  }

  // Get Peer instance
  getPeer(): Peer {
    return this.peer;
  }

  // Notify when new users join the room
  onUserConnected(callback: (userId: string) => void): void {
    this.socketService.getSocket().on('user-connected', (userId: string) => {
      callback(userId);
    });
  }

  // Notify when users leave the room
  onUserDisconnected(callback: (userId: string) => void): void {
    this.socketService.getSocket().on('user-disconnected', (userId: string) => {
      callback(userId);
    });
  }


  // Make a call to the given remote peer ID
  callPeer(remotePeerId: string, localStream: MediaStream): MediaConnection {
    const call = this.peer.call(remotePeerId, localStream);
    this.currentCall = call;
    return call;
  }

  // Answer an incoming call with the given stream
  answerCall(call: MediaConnection, localStream: MediaStream): void {
    this.currentCall = call;
    call.answer(localStream);
  }

  // Handle incoming calls
  onIncomingCall(callback: (call: MediaConnection) => void): void {
    this.peer.on('call', (call: MediaConnection) => {
      callback(call);
    });
  }

  // Close the current call
  endCall(): void {
    if (this.currentCall) {
      this.currentCall.close();
      console.log('Call ended.');
    }
  }

  // Stop the local media stream and release the resources
  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      console.log('Local stream stopped.');
    }
  }

  // Disconnect from the peer server and close the peer connections
  disconnectPeer(): void {
    if (this.peer) {
      this.peer.destroy();
      console.log('Peer connection closed.');
    }
  }

  // Save and provide access to the local stream
  setLocalStream(stream: MediaStream): void {
    this.localStream = stream;
  }

  getLocalStream(): MediaStream {
    return this.localStream;
  }

  // Set the screen stream
  setScreenStream(screenStream: MediaStream): void {
    this.screenStream = screenStream;
  }

  getScreenStream(): MediaStream | null {
    return this.screenStream;
  }

  // Stop the screen stream
  stopScreenStream(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
      console.log('Screen stream stopped.');
    }
  }
}
