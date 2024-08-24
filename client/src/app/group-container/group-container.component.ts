import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupStoreService } from '../group-store.service';
import { ChannelStoreService } from '../channel-store.service';
import { Group } from '../interfaces/group.interface';
import { Channel } from '../interfaces/channel.interface';
import { ChannelService } from '../channel.service';

@Component({
  selector: 'app-group-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-container.component.html',
  styleUrl: './group-container.component.css'
})
export class GroupContainerComponent implements OnInit {
  defaultGroups: Group[] = [];
  viewableGroups: Group[] = [];
  selectedGroup: Group | null = null;
  defaultChannels: Channel[] = [];
  allGroupChannels: Channel[] = [];
  selectedChannelID: number | null = null;

  constructor(private groupStoreService: GroupStoreService, private channelStoreService: ChannelStoreService, private channelService: ChannelService) {}

  ngOnInit(): void {
    // Load initial groups
    this.defaultGroups = [
      { groupID: 1, memberIDs: [1, 2, 3, 4, 5], name: "Group 1" },
      { groupID: 2, memberIDs: [1, 2, 3, 4, 5], name: "Group 2" },
      { groupID: 3, memberIDs: [2, 5], name: "Group 3" },
      { groupID: 4, memberIDs: [1, 2, 3], name: "Group 4" },
    ];

    // Load initial channels
    this.defaultChannels = [
      { channelID: 1, groupID: 1, name: "Channel 1" },
      { channelID: 2, groupID: 1, name: "Channel 2" },
      { channelID: 3, groupID: 1, name: "Channel 3" },
      { channelID: 4, groupID: 2, name: "Channel 4" },
      { channelID: 5, groupID: 3, name: "Channel 5" },
    ];

    // Save these groups using the service
    this.groupStoreService.initializeGroups(this.defaultGroups);
    this.channelStoreService.initializeChannels(this.defaultChannels);
    this.viewableGroups = this.groupStoreService.getViewableGroups();
  }

  onGroupClick(groupID: number): void {
    this.selectedGroup = this.viewableGroups.find(group => group.groupID === groupID) || null;

    // Ensure selectedGroup is not null before accessing groupID
    if (this.selectedGroup) {
      this.allGroupChannels = this.channelStoreService.getAllGroupChannels(this.selectedGroup.groupID);
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
}
