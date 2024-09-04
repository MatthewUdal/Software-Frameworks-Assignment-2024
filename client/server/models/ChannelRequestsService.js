const fs = require('fs');
const path = require('path');
const ChannelRequest = require('../models/ChannelRequest');

const channelRequestFilePath = path.join(__dirname, '..', 'data', 'channelRequests.json');

class ChannelRequestService {
    // method used to read all channel requests and return a channelRequest instance
    static readRequests() {
        return new Promise((resolve, reject) => {
            fs.readFile(channelRequestFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                try {
                    const requests = data ? JSON.parse(data) : [];
                    const requestObjects = requests.map(request =>
                        new ChannelRequest(request.channelRequestID, request.groupID, request.channelID, request.userID));
                    resolve(requestObjects);
                } catch (parseErr) {
                    reject(new Error('Failed to parse JSON data.'));
                }
            });
        });
    }

    // method used to write a channelRequest instance
    static writeRequests(requests) {
        return new Promise((resolve, reject) => {
            fs.writeFile(channelRequestFilePath, JSON.stringify(requests, null, 2), 'utf8', (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    // method used to create a channel request 
    static createRequest(userID, channelID, groupID) {
        return new Promise((resolve, reject) => {
            fs.readFile(channelRequestFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);

                let requests;
                try {
                    requests = data ? JSON.parse(data) : [];
                } catch (parseErr) {
                    return reject(new Error('Failed to parse JSON data.'));
                }

                const newRequestID = requests.length ? Math.max(...requests.map(req => req.channelRequestID)) + 1 : 1;

                const newRequest = new ChannelRequest(newRequestID, groupID, channelID, userID);
                requests.push(newRequest);

                fs.writeFile(channelRequestFilePath, JSON.stringify(requests, null, 2), 'utf8', (err) => {
                    if (err) return reject(err);
                    resolve(newRequestID);
                });
            });
        });
    }

    // method used to delete a channel request 
    static deleteRequest(channelRequestID) {
        return new Promise((resolve, reject) => {
            fs.readFile(channelRequestFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);

                let requests;
                try {
                    requests = data ? JSON.parse(data) : [];
                } catch (parseErr) {
                    return reject(new Error('Failed to parse JSON data.'));
                }

                requests = requests.filter(request => request.channelRequestID !== channelRequestID);

                fs.writeFile(channelRequestFilePath, JSON.stringify(requests, null, 2), 'utf8', (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
    }
}

module.exports = ChannelRequestService;
