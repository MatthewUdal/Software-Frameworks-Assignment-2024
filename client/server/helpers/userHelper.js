const User = require('../models/User');

class UserHelper {
  // Method to delete a test user by email
  static async deleteTestUser(email) {
    try {
      const deletedUser = await User.findOneAndDelete({ email });
      return deletedUser ? `User with email ${email} deleted successfully` : `No user found with email ${email}`;
    } catch (err) {
      throw new Error(`Error deleting user: ${err.message}`);
    }
  }

  // method used to create a new user
  static async createTestUser({ username, email, password }) {
    try {
      const newUser = new User({
        username,
        email,
        password,
        role: 'user'
      });
  
      const savedUser = await newUser.save();
  
      return savedUser;
    } catch (err) {
      throw new Error(`Error creating user: ${err.message}`);
    }
  }
}

module.exports = UserHelper;
