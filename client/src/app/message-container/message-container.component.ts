import { Component, ViewChild, ElementRef, OnInit, AfterViewChecked } from '@angular/core';
import { ChannelService } from '../channel.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../socket-service.service';
import { Channel } from '../interfaces/channel.interface';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../settings.service';
import { SettingsComponent } from '../settings/settings.component';
import { Chat } from '../interfaces/chat.interface';
import { GetUserService } from '../get-user.service';
import { Router } from '@angular/router';
// import { PeerServiceService } from '../peer-service.service';


@Component({
  selector: 'app-message-container',
  standalone: true,
  imports: [CommonModule, SettingsComponent], 
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.css']
})
export class MessageContainerComponent implements OnInit, AfterViewChecked {
  selectedChannel: Channel | null = null;
  settingsVisible = false;
  userID!: string | null;
  messages: Chat[] = []; 
  @ViewChild('messageBox') messageBox!: ElementRef;

  constructor(
    private channelService: ChannelService,
    private settingsService: SettingsService,
    private socketService: SocketService,
    private http: HttpClient,
    private userService: GetUserService,
    private router: Router,
    // private peerService: PeerServiceService
  ) {}

  ngOnInit(): void {
    this.userID = this.userService.getUserID();
    const username = this.userService.getUsername();

    if (!this.userID || !username) {
      console.error('User ID or Username is null. Cannot join channel.');
      return;
    }

    // Subscribe to changes in selected channel
    this.channelService.selectedChannel$.subscribe(channel => {
      this.selectedChannel = channel;
      if (channel) {
        // Load previous messages first before joining the channel
        this.loadPreviousMessages(channel._id).then(() => {
          this.socketService.joinChannel(channel._id, this.userID!, username);
        });
      }
    });    

    this.settingsService.settingsVisible$.subscribe(visible => {
      this.settingsVisible = visible;
    });

    this.socketService.onNewMessage().subscribe((message: Chat) => {
      if (this.selectedChannel && message.channelID === this.selectedChannel._id) {
        this.messages.push(message);
        console.log(this.messages);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.selectedChannel !== null){
      this.scrollToBottom();
    }
  }

  // Modify the loadPreviousMessages to return a promise that resolves when messages are loaded
  loadPreviousMessages(channelID: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post<Chat[]>('https://s5394035.elf.ict.griffith.edu.au:3000/chat/getMessages', { channelID })
        .subscribe({
          next: (msg) => {
            this.messages = msg;
            console.log(this.messages);
            resolve();  // Resolve the promise after messages are loaded
          },
          error: (err) => {
            console.error('Failed to load previous messages:', err);
            reject(err);  // Reject the promise if an error occurs
          }
        });
    });
  }

  onSend(messageInput: HTMLInputElement): void {
    const message = messageInput.value.trim();
    if (message) {
      this.sendMessage(message);
      messageInput.value = '';
    }
  }

  uploadImage(imageFile: File) {
    if (!imageFile.type.startsWith('image/')) {
      console.error('The selected file is not an image.');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
  
    this.http.post<{ imageUrl: string }>('https://s5394035.elf.ict.griffith.edu.au:3000/chat/uploadImage', formData).subscribe(res => {
      const fullImageUrl = `https://s5394035.elf.ict.griffith.edu.au:3000${res.imageUrl}`;
      this.sendMessage(fullImageUrl);
      this.scrollToBottom();
    })
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const imageFile = input.files[0];
        this.uploadImage(imageFile);
    }
  }

  sendMessage(message: string): void {
    if (this.selectedChannel && this.userID) {
      this.socketService.sendMessage(this.selectedChannel._id, this.userID, message);
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      const messageBoxElement = this.messageBox.nativeElement;
      messageBoxElement.scrollTop = messageBoxElement.scrollHeight;
    } catch (err) {
      console.error('Error while scrolling to the bottom:', err);
    }
  }
  
  startChannelCall(){
    // this.peerService.startCall();
    this.router.navigate(['/videocall']);
    console.log('going to call');
  } 


  isImage(message: string): boolean {
    return /\.(jpeg|jpg|gif|png|svg)$/.test(message);
  }

}
