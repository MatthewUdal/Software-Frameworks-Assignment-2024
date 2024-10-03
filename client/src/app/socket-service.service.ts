import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { socketConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {

  constructor() {
    super(socketConfig);
  }

  getSocket(): Socket {
    return this;
  }

  joinChannel(channelID: string, userID: string, username: string): void {
    this.emit('joinChannel', { channelID, userID, username });
  }
  
  sendMessage(channelID: string, userID: string, message: string): void {
    this.emit('sendMessage', { channelID, userID, message });
  }

  onNewMessage(): Observable<any> {
    return this.fromEvent('newMessage');
  }

  // Additional helper method for joining a room for video calls
  joinRoom(roomId: string, peerId: string): void {
    this.emit('join-room', { roomId, peerId });
  }

  // Listen for users connecting to the room
  onUserConnected(): Observable<any> {
    return this.fromEvent('user-connected');
  }

  // Listen for users disconnecting from the room
  onUserDisconnected(): Observable<any> {
    return this.fromEvent('user-disconnected');
  }
}
