import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
      const defaultUser = { userID: 1, username: 'user1', email: 'user1@example.com', password: 'password1', role: 'superAdmin', groups: [] };

      // Retrieve existing users from localStorage
      let existingUsers: any[] = [];
      const storedUsers = localStorage.getItem('user');

      if (storedUsers) {
        try {
          existingUsers = JSON.parse(storedUsers);
        } catch (error) {
          console.error('Error parsing existing users:', error);
        }
      }

      // Check if the default user already exists
      const userExists = existingUsers.some(user => user.email === defaultUser.email || user.username === defaultUser.username);

      if (!userExists) {
        // Add the default user to the list
        existingUsers.push(defaultUser);

        // Save the updated user list to localStorage
        localStorage.setItem('user', JSON.stringify(existingUsers));
      }
    } else {
      console.log('Multisend error, ignore this for now, user is uploaded');
    }
  }
}
