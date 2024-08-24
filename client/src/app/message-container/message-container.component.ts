import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../channel.service';
import { Channel } from '../interfaces/channel.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-message-container',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.css']
})
export class MessageContainerComponent implements OnInit {
  selectedChannel: Channel | null = null;

  constructor(private channelService: ChannelService) {}

  ngOnInit(): void {
    this.channelService.selectedChannel$.subscribe(channel => {
      this.selectedChannel = channel;
    });
  }
}
