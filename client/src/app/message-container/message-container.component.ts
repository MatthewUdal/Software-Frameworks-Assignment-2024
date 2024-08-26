import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../channel.service';
import { Channel } from '../interfaces/channel.interface';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../settings.service';
import { SettingsComponent } from '../settings/settings.component';


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


  constructor(private channelService: ChannelService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.channelService.selectedChannel$.subscribe(channel => {
      this.selectedChannel = channel;
    });

    this.settingsService.settingsVisible$.subscribe(visible => {
      this.settingsVisible = visible;
    });
  }
}
