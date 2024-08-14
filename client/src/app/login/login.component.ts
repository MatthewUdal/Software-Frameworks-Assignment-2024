import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  // userList = localStorage.getItem('user');

  constructor(private router: Router, private httpClient: HttpClient) { }
  

  onLogin() {
    const userList = localStorage.getItem('user');
    this.httpClient.post('http://localhost:3000/login', { email: this.email, password: this.password, userList: userList }, httpOptions)
      .subscribe((response: any) => {
        if (response.success) {
          sessionStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/homepage']);
        } else {
          console.log("Invalid Email or Password.");
          alert("Invalid Email or Password.");
        }
      }, (error) => {
        console.error('Login error:', error);
        alert("An error occurred during login.");
      });
  }
}
