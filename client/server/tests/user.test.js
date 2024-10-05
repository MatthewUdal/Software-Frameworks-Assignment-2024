const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Route and Function tests involving the user', () => {
  // Test case for a valid userID
  it('POST /verifyUser - returns success when userID is valid', (done) => {
    const validUserID = '60d21b4667d0d8992e610c85';

    chai.request(server)
      .post('/verifyUser')
      .send({ userID: validUserID })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('message', 'User is valid');
        done();
      });
  });

  // Test case for a missing userID
  it('POST /verifyUser - returns an error when userID is missing', (done) => {
    chai.request(server)
      .post('/verifyUser')
      .send({}) 
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', false);
        expect(res.body).to.have.property('message', 'UserID is required');
        done();
      });
  });

  // Test case for an invalid userID (userID not found)
  it('POST /verifyUser - returns an error when userID is not found', (done) => {
    const nonExistentUserID = '60d21b4667d0d8992e610c84'; 

    chai.request(server)
      .post('/verifyUser')
      .send({ userID: nonExistentUserID })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success', false);
        expect(res.body).to.have.property('message', 'User not found');
        done();
      });
  });
});
