import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Group } from '../interfaces/group.interface';
import { Channel } from '../interfaces/channel.interface';
import { ChannelService } from '../channel.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-group-container',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './group-container.component.html',
  styleUrl: './group-container.component.css'
})

export class GroupContainerComponent implements OnInit {
  groups: Group[] = [];
  channels: Channel[] = [];
  viewableGroups: Group[] = [];
  selectedGroup: Group | null = null;
  allGroupChannels: Channel[] = [];
  selectedChannelID: number | null = null;

  constructor(private http: HttpClient, private channelService: ChannelService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    const userID = this.getUserID();
    if (userID) {
      this.loadGroups(userID);
    }
    this.loadChannels();
  }

  getUserID(): string | null {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      return null; // if no data, return null
    }

    const currentUser = JSON.parse(userData);
    return currentUser.userID || null;
  }

  loadGroups(userID: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<Group[]>('http://localhost:3000/groups', { userID }, httpOptions).subscribe(groups => {
      this.groups = groups;
      this.viewableGroups = [...this.groups]; 
    }, error => {
      console.error('Error loading groups:', error);
    });
  }

  loadChannels(): void {
    this.http.get<Channel[]>('http://localhost:3000/channels').subscribe(channels => {
      this.channels = channels;
    });
  }

  onGroupClick(groupID: number): void {
    this.selectedGroup = this.groups.find(group => group.groupID === groupID) || null;
  
    if (this.selectedGroup) {
      this.allGroupChannels = this.channels.filter(channel => channel.groupID === this.selectedGroup!.groupID);
    }
  }

  onChannelClick(channelID: number): void {
    const channel = this.allGroupChannels.find(ch => ch.channelID === channelID);
    this.selectedChannelID = channelID;

    if (channel) {
      this.channelService.selectChannel(channel);
    }
  }

  onBackClick(): void {
    this.selectedGroup = null;
    this.allGroupChannels = [];
  }

  settingsClick(): void {
    this.settingsService.toggleSettings();
  }
  
}
