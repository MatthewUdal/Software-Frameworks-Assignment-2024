const mongoose = require('mongoose');
const User = require('../models/User');

class UserService {
    // method used to read all users and return an array of user instances
    static async readUsers() {
        try {
            // Fetch all users from MongoDB
            return await User.find().exec();
        } catch (err) {
            throw new Error(`Error reading users: ${err.message}`);
        }
    }

    // find user with a valid email and password combo (login)
    static async findUser(email, password) {
        try {
            const user = await User.findOne({ email, password });
            return user;
        } catch (err) {
            throw new Error('Error finding user');
        }
    }

    // auth check userID
    static async findUserByID(userID) {
        try {
          const user = await User.findOne({ _id: userID });
      
          if (!user) {
            return null;
          }
      
          return user;
        } catch (err) {
          throw new Error('Error finding user by ID');
        }
    }

    // method used to check if a user exists by username or email
    static async userExists(username, email) {
        try {
            const user = await User.findOne({
                $or: [{ username }, { email }]
            });
            console.log('User found:', user);
            return user;
        } catch (err) {
            console.error('Error checking user existence:', err);
            throw err;
        }
    }

    // method used to create a new user
    static async createUser(username, email, password) {
        try {
            const existingUser = await this.userExists(username, email);
            if (existingUser) {
                throw new Error('User with this username or email already exists');
            }
            
            const newUser = new User({
                username,
                email,
                password,
                role: 'user'
            });
    
            const savedUser = await newUser.save();
            
            // Use savedUser._id as the unique user ID
            return savedUser; // You can reference savedUser._id as the userID
        } catch (err) {
            throw new Error(`Error creating user: ${err.message}`);
        }
    }

    static async updateUserProfilePicture(userID, imageUrl) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userID,
                { profilePicture: imageUrl },
                { new: true } // Returns the updated document
            );
            return updatedUser;
        } catch (err) {
            throw new Error(`Error updating user profile picture: ${err.message}`);
        }
    }
}

module.exports = UserService;
