import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Group } from '../interfaces/group.interface';
import { CommonModule } from '@angular/common';
import { GetUserService } from '../get-user.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit{

  joinableGroups: Group[] = [];

  constructor(private http: HttpClient, private userService: GetUserService) {}

  ngOnInit(): void {
    const userID = this.userService.getUserID();
    if (userID) {
      this.getJoinableGroups(userID);
    }
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

  requestGroup(groupID: string): void {
    const userID = this.userService.getUserID();
    if (!userID) {
      console.error('No user ID found');
      return;
    }
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    this.http.post('http://localhost:3000/explore/join', { userID, groupID }, httpOptions).subscribe(
      (response: any) => { 
        if (response && response.groupName) {
          alert(`Successfully requested to join ${response.groupName}`);
          this.getJoinableGroups(userID);
        } else {
          alert('Group name not found');
        }
      },
      error => {
        console.error('Error joining group:', error);
        alert('Error joining group, please try again later');
      }
    );
  }

}
