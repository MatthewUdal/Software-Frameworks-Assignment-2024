const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { app } = require('../server');

const UserHelper = require('../helpers/userHelper');
const GroupHelper = require('../helpers/groupHelper');

chai.use(chaiHttp);

describe('Channel Routes', () => {
  let testUser1;
  let testUser2;
  let testUser3;
  let testGroup;
  let requestID1;
  let requestID2;

  before(async () => {
    // Create three test users
    testUser1 = await UserHelper.createTestUser({ username: 'testUser1', email: 'testUser1@example.com', password: 'testpassword' });
    testUser2 = await UserHelper.createTestUser({ username: 'testUser2', email: 'testUser2@example.com', password: 'testpassword' });
    testUser3 = await UserHelper.createTestUser({ username: 'testUser3', email: 'testUser3@example.com', password: 'testpassword' });

    // Create a test group using the first test user
    testGroup = await GroupHelper.createGroup('Test Group', testUser1._id);
  });

  after(async () => {
    // Delete the test group
    if (testGroup) await GroupHelper.deleteGroup(testGroup._id);

    // Delete the three test users
    if (testUser1) await UserHelper.deleteTestUser(testUser1.email);
    if (testUser2) await UserHelper.deleteTestUser(testUser2.email);
    if (testUser3) await UserHelper.deleteTestUser(testUser3.email);
  });

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
          requestID1 = res.body.requestID;
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
          requestID2 = res.body.requestID;
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
          expect(res.body[0]).to.have.property('requestID', requestID1.toString());
          expect(res.body[0]).to.have.property('userID', testUser2._id.toString());
          expect(res.body[0]).to.have.property('username', 'testUser2');
          expect(res.body[1]).to.have.property('requestID', requestID2.toString());
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
        .send({ userID: testUser2._id, requestID: requestID1, groupID: testGroup._id })
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
        .send({ requestID: requestID2 })
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
