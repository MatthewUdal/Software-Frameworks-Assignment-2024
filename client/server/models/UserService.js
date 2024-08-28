const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const userFilePath = path.join(__dirname, '..', 'data', 'users.json');

class UserService {
    static readUsers() {
        return new Promise((resolve, reject) => {
            fs.readFile(userFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const users = JSON.parse(data).map(user => new User(user.userID, user.username, user.email, user.password, user.role));
                resolve(users);
            });
        });
    }

    static writeUsers(users) {
        return new Promise((resolve, reject) => {
            fs.writeFile(userFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    static async userExists(username, email) {
        const users = await this.readUsers();
        return users.find(user => user.email === email || user.username === username);
    }

    static async createUser(username, email, password) {
        const users = await this.readUsers();
        
        const newUserID = users.length ? Math.max(...users.map(user => user.userID)) + 1 : 1;

        const newUser = new User(newUserID, username, email, password, 'user');
        users.push(newUser);

        await this.writeUsers(users);

        return newUser;
    }
}

module.exports = UserService;
