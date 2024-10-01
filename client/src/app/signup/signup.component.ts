import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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

  onSignup(form: NgForm) {
    if (form.invalid) {
      alert('Please fill in all required fields.');
      return;
    }
    this.httpClient.post('https://s5394035.elf.ict.griffith.edu.au:3000/signup', { username: this.username, email: this.email, password: this.password }, httpOptions)
      .subscribe((response: any) => {
        if (response.success) {
          sessionStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/dashboard']);
        } else if (response.failure) {
          alert(response.message);
        }
      }, (error) => {
        console.error('Signup error:', error);
        alert("An error occurred during signup.");
      });
  }
}
