import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Group } from '../interfaces/group.interface';
import { Channel } from '../interfaces/channel.interface';
import { ChannelService } from '../channel.service';
import { SettingsService } from '../settings.service';
import { RoleService } from '../role.service';
import { GetUserService } from '../get-user.service';
import { Router } from '@angular/router';

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
  selectedChannelID: string | null = null;
  groupID!: number;
  userID!: string | null;
  isAdmin: boolean = false;

  constructor(private http: HttpClient, private channelService: ChannelService, private settingsService: SettingsService, private roleService: RoleService, private userService: GetUserService, private router: Router) {}

  ngOnInit(): void {
    this.userID = this.userService.getUserID();
    this.checkAdmin();

    if (this.userID) {
      this.loadGroups(this.userID);
      if (this.isAdmin !== true){
        this.loadChannels(this.userID);
      } else {
        this.loadAllChannels();
      }
    }
  }


  checkAdmin(): void {
    this.groupID = Number(sessionStorage.getItem('cg'));

    const role = this.roleService.getUserRole();
    if (role === 'superAdmin' || role === 'groupAdmin'){
      this.isAdmin = true;
    } 
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

  loadChannels(userID: string): void {    
    this.http.post<Channel[]>('http://localhost:3000/channels/myChannels', { userID } ).subscribe(channels => {
      this.channels = channels;
    });
  }

  loadAllChannels(): void {    
    this.http.get<Channel[]>('http://localhost:3000/channels/').subscribe(channels => {
      this.channels = channels;
    });
  }

  onGroupClick(groupID: string): void {
    this.selectedGroup = this.groups.find(group => group._id === groupID) || null;
    sessionStorage.setItem('cg', groupID);
  
    if (this.selectedGroup) {
      this.allGroupChannels = this.channels.filter(channel => channel.groupID === this.selectedGroup!._id);
    }
  }

  onChannelClick(channelID: string): void {
    const channel = this.allGroupChannels.find(ch => ch._id === channelID);
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

  createGroup(){
    this.router.navigate(['/group-creation']);
  }

  browseChannels(){
    this.router.navigate(['/channel-explore']);
  }
  
}
