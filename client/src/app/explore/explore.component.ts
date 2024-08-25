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
    console.log('Requested to join group with ID:', groupID);
    alert(`Requested to join group with ID: ${groupID}`);
  }

}
