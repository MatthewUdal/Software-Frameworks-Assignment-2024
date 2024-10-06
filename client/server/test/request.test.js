const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { app } = require('../server');

const UserHelper = require('../helpers/userHelper');
const GroupHelper = require('../helpers/groupHelper');
const ChannelHelper = require('../helpers/channelHelper');

chai.use(chaiHttp);

describe('Channel and Group Routes', () => {
  let testUser1;
  let testUser2;
  let testUser3;
  let testGroup;
  let testChannel;
  let groupRequestID1;
  let groupRequestID2;
  let channelRequestID1;
  let channelRequestID2;

  before(async () => {
    // Create three test users
    testUser1 = await UserHelper.createTestUser({ username: 'testUser1', email: 'testUser1@example.com', password: 'testpassword' });
    testUser2 = await UserHelper.createTestUser({ username: 'testUser2', email: 'testUser2@example.com', password: 'testpassword' });
    testUser3 = await UserHelper.createTestUser({ username: 'testUser3', email: 'testUser3@example.com', password: 'testpassword' });

    // Create a test group using the first test user
    testGroup = await GroupHelper.createGroup('Test Group', testUser1._id);

    // Create a test channel in the created group
    testChannel = await ChannelHelper.addChannel(testGroup._id, 'Test Channel', testUser1._id);
  });

  after(async () => {
    // Delete the test channel
    if (testChannel) await ChannelHelper.deleteChannel(testChannel._id);

    // Delete the test group
    if (testGroup) await GroupHelper.deleteGroup(testGroup._id);

    // Delete the three test users
    if (testUser1) await UserHelper.deleteTestUser(testUser1.email);
    if (testUser2) await UserHelper.deleteTestUser(testUser2.email);
    if (testUser3) await UserHelper.deleteTestUser(testUser3.email);
  });

  describe('Group Routes', () => {
    describe('POST /explore', () => {
      it('should get all joinable groups for a specific user', (done) => {
        chai.request(app)
          .post('/explore')
          .send({ userID: testUser2._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.greaterThan(0);
            done();
          });
      });
    });

    describe('POST /explore/join', () => {
      it('should create a join request for a group', (done) => {
        chai.request(app)
          .post('/explore/join')
          .send({ userID: testUser2._id, groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Request Sent');
            expect(res.body).to.have.property('groupID', testGroup._id.toString());
            groupRequestID1 = res.body.requestID;
            done();
          });
      });

      it('should create a second join request for another user', (done) => {
        chai.request(app)
          .post('/explore/join')
          .send({ userID: testUser3._id, groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Request Sent');
            expect(res.body).to.have.property('groupID', testGroup._id.toString());
            groupRequestID2 = res.body.requestID;
            done();
          });
      });

      it('should not create a duplicate join request', (done) => {
        chai.request(app)
          .post('/explore/join')
          .send({ userID: testUser2._id, groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Request already exists');
            done();
          });
      });
    });

    describe('POST /requests/getRequests', () => {
      it('should get all join requests for a group', (done) => {
        chai.request(app)
          .post('/requests/getRequests')
          .send({ groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2);
            expect(res.body[0]).to.have.property('requestID', groupRequestID1.toString());
            expect(res.body[0]).to.have.property('userID', testUser2._id.toString());
            expect(res.body[0]).to.have.property('username', 'testUser2');
            expect(res.body[1]).to.have.property('requestID', groupRequestID2.toString());
            expect(res.body[1]).to.have.property('userID', testUser3._id.toString());
            expect(res.body[1]).to.have.property('username', 'testUser3');
            done();
          });
      });
    });

    describe('POST /requests/approveRequest', () => {
        it('should approve a join request and add the user to the group', (done) => {
          chai.request(app)
            .post('/requests/approveRequest')
            .send({ userID: testUser2._id, requestID: groupRequestID1, groupID: testGroup._id })
            .end(async (err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('success', true);
              done();
            });
        });
      });
    
      describe('POST /requests/declineRequest', () => {
        it('should decline a join request and remove it from the database', (done) => {
          chai.request(app)
            .post('/requests/declineRequest')
            .send({ requestID: groupRequestID2 })
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('success', true);
              expect(res.body).to.have.property('message', 'Request removed successfully');
    
              // Check if the request is deleted
              chai.request(app)
                .post('/requests/getRequests')
                .send({ groupID: testGroup._id })
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an('array');
                  expect(res.body.length).to.equal(0);
                  done();
                });
            });
        });
    });
  });

  describe('Channel Routes', () => {
    describe('POST /channels', () => {
      it('should get all joinable channels for a user in a specific group', (done) => {
        chai.request(app)
          .post('/channelExplore')
          .send({ userID: testUser2._id, groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1); 
            done();
          });
      });
    });

    describe('POST /channelExplore/join', () => {
      it('should create a channel join request', (done) => {
        chai.request(app)
          .post('/channelExplore/join')
          .send({ userID: testUser2._id, channelID: testChannel._id, groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Request Sent');
            expect(res.body).to.have.property('channelID', testChannel._id.toString());
            channelRequestID1 = res.body.requestID;
            done();
          });
      });

      it('should create a second channel join request', (done) => {
        chai.request(app)
          .post('/channelExplore/join')
          .send({ userID: testUser3._id, channelID: testChannel._id, groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Request Sent');
            expect(res.body).to.have.property('channelID', testChannel._id.toString());
            channelRequestID2 = res.body.requestID;
            done();
          });
      });

      it('should not create a duplicate channel join request', (done) => {
        chai.request(app)
          .post('/channelExplore/join')
          .send({ userID: testUser2._id, channelID: testChannel._id, groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Request already exists');
            done();
          });
      });
    });

    describe('POST /channels/getRequests', () => {
      it('should get all channel join requests for a group', (done) => {
        chai.request(app)
          .post('/channelRequests/getRequests')
          .send({ groupID: testGroup._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(2); 
            done();
          });
      });
    });

    describe('POST /channelRequests/approveRequest', () => {
      it('should approve a channel join request and add the user to the channel', (done) => {
        chai.request(app)
          .post('/channelRequests/approveRequest')
          .send({ userID: testUser2._id, channelRequestID: channelRequestID1, channelID: testChannel._id })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            done();
          });
      });
    });

    describe('POST /channelRequests/declineRequest', () => {
      it('should decline a channel join request and remove it from the database', (done) => {
        chai.request(app)
          .post('/channelRequests/declineRequest')
          .send({ channelRequestID: channelRequestID2 })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            done();
          });
      });
    });
  });
});
