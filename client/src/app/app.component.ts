import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { warn } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Software-Frameworks-Assignment-2024';

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      // Define a sample user
      const user = [
          { userID: 1, username: 'user1', email: 'user1@example.com', password: 'password1', role: 'superAdmin', groups: [] }
        ];

      // Convert the user object to a JSON string and save it to localStorage
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      console.log('Multisend error, ignore this for now, user is uploaded');
    }
  }
}
