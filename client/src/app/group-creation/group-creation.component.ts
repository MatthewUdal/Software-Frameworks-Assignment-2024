import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-group-creation',
  standalone: true,
  imports: [NavbarComponent, FormsModule, HttpClientModule],
  templateUrl: './group-creation.component.html',
  styleUrl: './group-creation.component.css'
})
export class GroupCreationComponent implements OnInit {
  groupName: string = '';
  userID!: string | null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.userID = this.getUserID();
  }

  getUserID(): string | null {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      return null; 
    }

    const currentUser = JSON.parse(userData);
    return currentUser.userID || null;
  }

  createGroup(): void{
    this.http.post('http://localhost:3000/groups/createGroup', { userID: this.userID, groupName: this.groupName })
      .subscribe(response => {
        console.log('Created Group Successfully', response);
        this.router.navigate(['/homepage']);
      }, error => {
        console.error('Error creating group:', error);
      });
  }

}
