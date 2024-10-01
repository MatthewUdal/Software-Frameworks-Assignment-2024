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

  joinChannel(channelID: string, userID: string, username: string): void {
    this.emit('joinChannel', { channelID, userID, username });
  }
  

  sendMessage(channelID: string, userID: string, message: string): void {
    this.emit('sendMessage', { channelID, userID, message });
  }

  onNewMessage(): Observable<any> {
    return this.fromEvent('newMessage');
  }
}
