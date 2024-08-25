import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Group } from '../interfaces/group.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit{

  joinableGroups: Group[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userID = this.getUserID();
    if (userID) {
      this.getJoinableGroups(userID);
    }
  }

  getUserID(): string | null {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      return null; 
    }

    const currentUser = JSON.parse(userData);
    return currentUser.userID || null;
  }

  getJoinableGroups(userID: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post<Group[]>('http://localhost:3000/explore', { userID }, httpOptions).subscribe(groups => {
      this.joinableGroups = groups


      console.log(this.joinableGroups);
    }, error => {
      console.error('Error loading groups:', error);
    });
  }

  requestGroup(groupID: number): void {
    const userID = this.getUserID();
    if (!userID) {
      console.error('No user ID found');
      return;
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    this.http.post('http://localhost:3000/explore/join', { userID, groupID }, httpOptions).subscribe(response => {
      alert(`Successfully requested to join group ${groupID}`);
    }, error => {
      console.error('Error joining group:', error);
      alert('Error joining group. Please try again later.');
    });
  }

}
