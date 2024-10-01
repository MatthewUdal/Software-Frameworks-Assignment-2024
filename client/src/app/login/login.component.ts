import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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

  constructor(private router: Router, private httpClient: HttpClient) { }

  onLogin(form: NgForm) {
    if (form.invalid) {
      alert('Please enter both email and password.');
      return;
    }

    this.httpClient.post('https://s5394035.elf.ict.griffith.edu.au:3000/login', { email: this.email, password: this.password }).subscribe((response: any) => {
      if (response.success) {
        sessionStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/dashboard']);
      } else if (response.failure) {
        alert(response.message);
      }
    }, (error) => {
      console.error('Login error:', error);
      alert("An error occurred during login.");
    });
  }
}
