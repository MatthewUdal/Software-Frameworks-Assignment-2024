class User {
    constructor(userID, username, email, password, role, groups) {
      this.userID = userID;
      this.username = username;
      this.email = email;
      this.password = password;
      this.role = role;
      this.groups = groups;
    }
  }
  
  module.exports = User;

