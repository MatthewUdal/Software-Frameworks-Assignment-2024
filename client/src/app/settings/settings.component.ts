import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../settings.service';
import { RoleService } from '../role.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { Channel } from '../interfaces/channel.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  channels: Channel[] = [];
  allGroupChannels: Channel[] = [];
  currentView: string = '';
  isAdmin: boolean = false;
  userRole!: string | null;
  groupID!: number;
  userID!: string | null;
  userRequests: { requestID: number; userID: number; username: string }[] = [];
  groupMembers: { userID: number, username: string, role: string }[] = [];
  channelName: string = '';
  selectedChannelID: number | null = null;
  activeMember: any = null;
  

  constructor(private settingsService: SettingsService, private http: HttpClient, private roleService: RoleService, private router: Router) {}

  ngOnInit(): void {
    this.currentView = 'group-settings';

    this.groupID = Number(sessionStorage.getItem('cg'));
    this.userID = this.getUserID();

    this.userRole = this.roleService.getUserRole();
    if (this.userRole === 'superAdmin'){
      this.isAdmin = true;
    } else {
      this.getPerms();
    }
    
  }


  getPerms() {
    this.http.post<{ success: boolean }>('http://localhost:3000/perms', { groupID: this.groupID, userID: this.userID })
      .subscribe(
        (response) => {
          if (response.success) {
            console.log('User is an admin');
            this.isAdmin = true;
          } else {
            console.log('User is not an admin');
            this.isAdmin = false;
          }
        },
        (error) => {
          console.error('Error fetching permissions:', error);
        }
      );
  }

  getUserID(): string | null {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      return null; 
    }

    const currentUser = JSON.parse(userData);
    return currentUser.userID || null;
  }

  setView(view: string): void {
    this.currentView = view;
  }

  leaveGroup(): void{
    this.http.post('http://localhost:3000/groups/leaveGroup', { groupID: this.groupID, userID: this.userID })
      .subscribe(response => {
        console.log('Left the group successfully');
        this.router.navigate(['/dashboard']);
        this.toggleSettings();
      }, error => {
        console.error('Error leaving the group', error);
      });
  }

  toggleSettings(): void {
    this.settingsService.toggleSettings();
  }


  loadRequests(): void {
    console.log('Loading requests for group:', this.groupID);
    this.http.post<{ requestID: number, userID: number, username: string }[]>('http://localhost:3000/requests/getRequests', { groupID: this.groupID })
      .subscribe(
        (response) => {
          this.userRequests = response;
          console.log('User Requests:', this.userRequests);
        },
        (error) => {
          console.error('Error loading user requests:', error);
        }
      );
  }

  approveRequest(userID: number, requestID: number): void {
    this.http.post<{ success: boolean }>('http://localhost:3000/requests/approveRequest', { userID, requestID, groupID: this.groupID })
      .subscribe(
        (response) => {
          if (response.success) {
            console.log('Request approved successfully');
            this.loadRequests();
          } else {
            console.error('Error approving request');
          }
        },
        (error) => {
          console.error('Error approving request:', error);
        }
      );
  }

  removeRequest(requestID: number): void {
    this.http.post<{ success: boolean, message: string }>('http://localhost:3000/requests/declineRequest', { requestID })
      .subscribe(
        response => {
          if (response.success) {
            console.log(response.message);
            this.loadRequests();
          } else {
            console.error(response.message);
          }
        },
        error => {
          console.error('Error removing request:', error);
        }
      );
  }

  addChannel(): void {
    const channelData = {
      groupID: this.groupID,
      name: this.channelName
    };

    this.http.post('http://localhost:3000/channels/addChannel', channelData)
      .subscribe(response => {
        console.log('Channel added successfully:', response);
      }, error => {
        console.error('Error adding channel:', error);
      });
  }

  loadChannels(): void {
    console.log('loading channels')
    this.http.get<Channel[]>('http://localhost:3000/channels').subscribe(channels => {
      this.channels = channels;
      this.allGroupChannels = this.channels.filter(channel => channel.groupID === this.groupID);
    });
  }
  
  onChannelClick(channelID: number): void {
    this.selectedChannelID = channelID;
  }

  deleteChannel(): void {
    this.http.post('http://localhost:3000/channels/deleteChannel', {channelID: this.selectedChannelID})
      .subscribe(response => {
        console.log('Channel deleted', response);
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error('Error deleting channel', error);
      });
  }

  deleteGroup(): void {
    this.http.post('http://localhost:3000/groups/deleteGroup', { groupID: this.groupID })
      .subscribe(response => {
        console.log('group deleted', response);
        this.toggleSettings();
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error('Error deleting group', error);
      });
  }

  loadMembers(): void {
    this.http.post<{ userID: number, username: string, role: string }[]>('http://localhost:3000/groups/getMembers', { groupID: this.groupID })
      .subscribe(
        (response) => {
          this.groupMembers = response;
        },
        (error) => {
          console.error('Error loading members:', error);
        }
    );
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'superAdmin':
        return 'role-superAdmin';
      case 'groupAdmin':
        return 'role-groupAdmin';
      default:
        return 'role-user';
    }
  }

  getRoleDisplayText(role: string): string {
    switch (role) {
      case 'superAdmin':
        return 'Super Admin';
      case 'groupAdmin':
        return 'Group Admin';
      case 'user':
        return 'User';
      default:
        return 'Unknown Role';
    }
  }

  

  toggleDropdown(member: any) {
    if (this.activeMember === member) {
      this.activeMember = null;
    } else {
      this.activeMember = member;
    }
  }


  kickUser(userID: number): void {
    this.http.post<{ success: boolean, message: string }>('http://localhost:3000/groups/kickUser', { groupID: this.groupID, userID })
      .subscribe(
        response => {
          if (response.success) {
            console.log(response.message);
            this.loadMembers();
          } else {
            console.error(response.message);
          }
        },
        error => {
          console.error('Error kicking user:', error);
        }
      );
  }

  promoteUser(userID: number, newRole: string): void {
    this.http.post<{ success: boolean, message: string }>('http://localhost:3000/promoteUser', { userID, newRole, groupID: this.groupID })
      .subscribe(response => {
          if (response.success) {
            console.log('User role updated successfully:', response.message);
            this.loadMembers();
          } else {
            console.error('Error updating user role:', response.message);
          }
        },
        error => {
          console.error('Error updating user role:', error);
        }
      );
  }
  
    
  banUser(userID: number){
    this.http.post<{ success: boolean, message: string }>('http://localhost:3000/banUser', { userID, groupID: this.groupID })
    .subscribe(response => {
        if (response.success) {
          console.log(response.message);
          this.loadMembers();
        } else {
          console.error(response.message);
        }
      },
      error => {
        console.error('Error banning user:', error);
      }
    );
  }

}
