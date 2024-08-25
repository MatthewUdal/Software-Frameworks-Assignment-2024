const User = require('../models/User');

class UserStore {
  constructor() {
    this.users = [];
  }

  // Load users from localStorage
  loadUsers() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers).map(u => new User(u.userID, u.username, u.email, u.password, u.role));
    }
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // Initialize users
  initializeUsers(initialUsers) {
    this.users = initialUsers.map(u => new User(u.userID, u.username, u.email, u.password, u.role));
    this.saveUsers();
  }

  // Add a new user
  addUser(user) {
    this.users.push(user);
    this.saveUsers();
  }

    // Find a user by email and password
    findUserByEmailAndPassword(email, password) {
        return this.users.find(u => u.email === email && u.password === password);
    }

}

module.exports = UserStore;
