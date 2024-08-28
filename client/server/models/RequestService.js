const fs = require('fs');
const path = require('path');
const Request = require('../models/Request');

const requestFilePath = path.join(__dirname, '..', 'data', 'requests.json');

class RequestService {
  static readRequests() {
    return new Promise((resolve, reject) => {
      fs.readFile(requestFilePath, 'utf8', (err, data) => {
        if (err) return reject(err);
        const requests = JSON.parse(data).map(req => new Request(req.requestID, req.groupID, req.userID));
        resolve(requests);
      });
    });
  }

  static writeRequests(requests) {
    return new Promise((resolve, reject) => {
      fs.writeFile(requestFilePath, JSON.stringify(requests, null, 2), 'utf8', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  static deleteRequest(requestID) {
    return this.readRequests()
      .then(requests => {
        const requestIndex = requests.findIndex(req => req.requestID === requestID);
        if (requestIndex === -1) throw new Error('Request not found');
        requests.splice(requestIndex, 1);
        return this.writeRequests(requests);
      });
  }
}

module.exports = RequestService;
