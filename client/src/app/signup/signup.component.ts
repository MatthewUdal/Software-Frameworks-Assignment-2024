import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router, private httpClient: HttpClient) { }

  onSignup() {
    const userList = localStorage.getItem('user');
    this.httpClient.post('http://localhost:3000/signup', { username: this.username, email: this.email, userList: userList }, httpOptions)
      .subscribe((response: any) => {
        if (response.success) {
          // Create the new user object
          const newUser = {
            userID: response.newID,
            username: this.username,
            email: this.email,
            password: this.password, 
            role: 'user', 
            groups: [] 
          };

          // Get the current user list from localStorage
          let users = [];
          if (userList) {
            users = JSON.parse(userList);
          }

          // Add the new user to the list
          users.push(newUser);

          console.log(newUser);
          console.log(users);

          // Save the updated user list to localStorage
          localStorage.setItem('user', JSON.stringify(users));

          sessionStorage.setItem('user', JSON.stringify(newUser));
          this.router.navigate(['/homepage']);
        } else if (response.message === "Account already exist.") {
          console.log("User Already Exists");
          alert("User Already Exists");
        } else if (response.message === "Email already exists.") {
          console.log(response.message);
          alert(response.message);
        } else if (response.message === "Username already exists.") {
          console.log(response.message);
          alert(response.message);
        }
      }, (error) => {
        console.error('Signup error:', error);
        alert("An error occurred during signup.");
      });
  }
}
