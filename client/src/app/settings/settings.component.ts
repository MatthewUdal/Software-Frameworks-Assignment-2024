import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../settings.service';
import { RoleService } from '../role.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  currentView: string = '';
  isAdmin: boolean = false;
  groupID!: number;
  userID!: string | null;
  userRequests: { requestID: number; userID: number; username: string }[] = [];

  constructor(private settingsService: SettingsService, private http: HttpClient, private roleService: RoleService) {}

  ngOnInit(): void {
    this.currentView = 'group-settings';

    this.groupID = Number(sessionStorage.getItem('cg'));
    this.userID = this.getUserID();

    const role = this.roleService.getUserRole();
    if (role === 'superAdmin'){
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

  leaveGroup(){
    console.log('leave group');
  }

  toggleSettings(): void {
    this.settingsService.toggleSettings();
  }


  loadRequests(): void {
    console.log('Loading requests for group:', this.groupID);
    this.http.post<{ requestID: number, userID: number, username: string }[]>('http://localhost:3000/getRequests', { groupID: this.groupID })
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
    this.http.post<{ success: boolean }>('http://localhost:3000/approveRequest', { userID, requestID, groupID: this.groupID })
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
    this.http.post<{ success: boolean, message: string }>('http://localhost:3000/declineRequest', { requestID })
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


}
