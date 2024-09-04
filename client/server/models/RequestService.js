const fs = require('fs');
const path = require('path');
const Request = require('../models/Request');

const requestFilePath = path.join(__dirname, '..', 'data', 'requests.json');

class RequestService {
  
  static readRequests() {
    // method used to read all requests and return an array of request instances
    return new Promise((resolve, reject) => {
      fs.readFile(requestFilePath, 'utf8', (err, data) => {
        if (err) return reject(err);
        const requests = JSON.parse(data).map(req => new Request(req.requestID, req.groupID, req.userID));
        resolve(requests);
      });
    });
  }

  // method used to write an instance of request
  static writeRequests(requests) {
    return new Promise((resolve, reject) => {
      fs.writeFile(requestFilePath, JSON.stringify(requests, null, 2), 'utf8', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  // method used to delete an instance of request and write back to requests
  static async deleteRequest(requestID) {
    const requests = await this.readRequests();
    const requestIndex = requests.findIndex(req => req.requestID === requestID);
    if (requestIndex === -1) throw new Error('Request not found');
    requests.splice(requestIndex, 1);
    return await this.writeRequests(requests);
  }
}

module.exports = RequestService;
