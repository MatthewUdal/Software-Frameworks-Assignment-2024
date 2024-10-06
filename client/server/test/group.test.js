const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { app } = require('../server');

const UserHelper = require('../helpers/userHelper');

chai.use(chaiHttp);

describe('Group Routes', () => {
  let testGroupID;
  let testUserID;

  const testUser = {
    username: 'groupTestUser',
    email: 'groupTestUser@example.com',
    password: 'testpassword',
  };

  before(async () => {
    // Create a test user
    const createdUser = await UserHelper.createTestUser(testUser);
    testUserID = createdUser._id.toString();
  });

  after(async () => {
    // Cleanup after all tests
    await UserHelper.deleteTestUser(testUser.email);
  });

  describe('POST /createGroup', () => {
    it('should create a new group and return the group object', (done) => {
      const newGroupData = { userID: testUserID, groupName: 'Test Group' };

      chai.request(app)
        .post('/groups/createGroup')
        .send(newGroupData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          testGroupID = res.body._id;
          done();
        });
    });
  });

  describe('POST /getMembers', () => {
    it('should return all members of the group', (done) => {
      chai.request(app)
        .post('/groups/getMembers')
        .send({ groupID: testGroupID })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          done();
        });
    });
  });

  describe('POST /kickUser', () => {
    it('should kick the user from the group successfully', (done) => {
      const data = { groupID: testGroupID, userID: testUserID };

      chai.request(app)
        .post('/groups/kickUser')
        .send(data)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message', 'User kicked from the group successfully');
          done();
        });
    });

    it('should return an error when trying to kick a non-existing user', (done) => {
      const data = { groupID: testGroupID, userID: '652570b07a4b9f1a4cfc93a8' };

      chai.request(app)
        .post('/groups/kickUser')
        .send(data)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'User not found');
          done();
        });
    });
  });


  describe('POST /deleteGroup', () => {
    it('should delete the group and all related data', (done) => {
      chai.request(app)
        .post('/groups/deleteGroup')
        .send({ groupID: testGroupID })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'Deleted group and all related data');
          done();
        });
    });
  });
});
