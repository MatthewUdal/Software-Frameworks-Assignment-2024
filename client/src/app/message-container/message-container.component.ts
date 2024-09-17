import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../channel.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../socket-service.service';
import { Channel } from '../interfaces/channel.interface';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../settings.service';
import { SettingsComponent } from '../settings/settings.component';
import { Chat } from '../interfaces/chat.interface';


@Component({
  selector: 'app-message-container',
  standalone: true,
  imports: [CommonModule, SettingsComponent], 
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.css']
})
export class MessageContainerComponent implements OnInit {
  selectedChannel: Channel | null = null;
  settingsVisible = false;
  messages: Chat[] = []; 

  constructor(
    private channelService: ChannelService,
    private settingsService: SettingsService,
    private socketService: SocketService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.channelService.selectedChannel$.subscribe(channel => {
      this.selectedChannel = channel;
      if (channel) {
        this.socketService.joinChannel(channel._id);
        this.loadPreviousMessages(channel._id);
        console.log(this.messages);
      }
    });

    this.settingsService.settingsVisible$.subscribe(visible => {
      this.settingsVisible = visible;
    });

    this.socketService.onNewMessage().subscribe((message: Chat) => {
      if (this.selectedChannel && message.channelID === this.selectedChannel._id) {
        this.messages.push(message);
      }
    });
  }

  loadPreviousMessages(channelID: string): void {
    this.http.post<Chat[]>('http://localhost:3000/chat/getMessages', { channelID } ).subscribe(msg => {
      this.messages = msg;
      console.log(this.messages);
    });
  }

  sendMessage(message: string): void {
    if (this.selectedChannel) {
      const userID = 'someUserID'; // Replace with actual userID
      this.socketService.sendMessage(this.selectedChannel._id, userID, message);
    }
  }
}