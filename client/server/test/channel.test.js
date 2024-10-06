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
  let testGroup;
  let testChannelID;

  before(async () => {
    // Create two test users
    testUser1 = await UserHelper.createTestUser({ username: 'testUser1', email: 'testUser1@example.com', password: 'testpassword' });
    testUser2 = await UserHelper.createTestUser({ username: 'testUser2', email: 'testUser2@example.com', password: 'testpassword' });

    // Create a test group using the first test user
    testGroup = await GroupHelper.createGroup('Test Group', testUser1._id);
  });

  after(async () => {
    // Delete the test group
    if (testGroup) await GroupHelper.deleteGroup(testGroup._id);

    // Delete the two test users
    if (testUser1) await UserHelper.deleteTestUser(testUser1.email);
    if (testUser2) await UserHelper.deleteTestUser(testUser2.email);
  });

  describe('POST /addChannel', () => {
    it('should add a new channel to the group', (done) => {
      const newChannelData = { groupID: testGroup._id, name: 'New Test Channel', userID: testUser1._id };

      chai.request(app)
        .post('/channels/addChannel')
        .send(newChannelData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('name', 'New Test Channel');
          testChannelID = res.body._id;
          done();
        });
    });

    it('should return a 400 error if required fields are missing', (done) => {
      const incompleteData = { groupID: testGroup._id, name: 'Incomplete Channel' };

      chai.request(app)
        .post('/channels/addChannel')
        .send(incompleteData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'GroupID, name, and userID are required');
          done();
        });
    });
  });

  describe('POST /myChannels', () => {
    it('should return all channels the user is part of', (done) => {
      chai.request(app)
        .post('/channels/myChannels')
        .send({ userID: testUser1._id })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].name).to.equal('New Test Channel');
          done();
        });
    });

    it('should return a 404 error if user does not exist', (done) => {
      const fakeUserID = '60d21b4667d0d8992e610c84';

      chai.request(app)
        .post('/channels/myChannels')
        .send({ userID: fakeUserID })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'User not found');
          done();
        });
    });
  });

  describe('POST /deleteChannel', () => {
    it('should delete a channel from the group', (done) => {
      chai.request(app)
        .post('/channels/deleteChannel')
        .send({ channelID: testChannelID })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('acknowledged', true);
          expect(res.body).to.have.property('deletedCount', 1);
          done();
        });
    });

    it('should return a 400 error if channelID is missing', (done) => {
      chai.request(app)
        .post('/channels/deleteChannel')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'ChannelID is required');
          done();
        });
    });
  });
});
