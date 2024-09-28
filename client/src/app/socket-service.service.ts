import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  joinChannel(channelID: string): void {
    this.socket.emit('joinChannel', { channelID });
  }

  sendMessage(channelID: string, userID: string, message: string): void {
    this.socket.emit('sendMessage', { channelID, userID, message });
  }

  onNewMessage(): Observable<any> {
    return this.socket.fromEvent('newMessage');
  }

  
}
