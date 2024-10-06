const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const { app } = require('../server');

const UserHelper = require('../helpers/userHelper');

chai.use(chaiHttp);

describe('Route and Function tests involving the user', () => {

  describe('POST /authCheck', () => {
    // Test case for a valid userID
    it('POST /authCheck/verifyUser - returns success when userID is valid', (done) => {
      const validUserID = '66e2b63bad1d7ba9286b0517';

      chai.request(app)
        .post('/authCheck/verifyUser')
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
    it('POST /authCheck/verifyUser - returns an error when userID is missing', (done) => {
      chai.request(app)
        .post('/authCheck/verifyUser')
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
    it('POST /authCheck/verifyUser - returns an error when userID is not found', (done) => {
      const nonExistentUserID = '60d21b4667d0d8992e610c84'; 

      chai.request(app)
        .post('/authCheck/verifyUser')
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
  })
  

  describe('POST /login', () => {
    // Test case for successful login
    it('POST /login - returns success and user object when credentials are valid', (done) => {
      const validCredentials = {
        email: 'user1@example.com',
        password: 'password1',
      };

      chai.request(app)
        .post('/login')
        .send(validCredentials)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.be.an('object');
          done();
        });
    });

    // Test case for invalid credentials
    it('POST /login - returns error when credentials are invalid', (done) => {
      const invalidCredentials = {
        email: 'fakeuser@example.com',
        password: 'fakepassword',
      };

      chai.request(app)
        .post('/login')
        .send(invalidCredentials)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'Invalid email or password');
          done();
        });
    });

    // Test case for missing a email or password
    it('POST /login - returns error when email or password is missing', (done) => {
      const missingEmail = { password: 'somepassword' };
      const missingPassword = { email: 'someuser@example.com' };

      // Test missing email
      chai.request(app)
        .post('/login')
        .send(missingEmail)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'Email and password are required');

          // Test missing password
          chai.request(app)
            .post('/login')
            .send(missingPassword)
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('success', false);
              expect(res.body).to.have.property('message', 'Email and password are required');
              done();
            });
          });
        });
    })



  describe('POST /signup', () => {
    const testUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
    };

    // Cleanup before running tests to ensure no existing user with testUser's email
    before(async () => {
      await UserHelper.deleteTestUser(testUser.email);
    });

    // Cleanup after all tests
    after(async () => {
      await UserHelper.deleteTestUser(testUser.email);
    });

    // Test case for successful signup
    it('POST /signup - returns success and user object when details are unique and all fields are provided', (done) => {
      chai.request(app)
        .post('/signup')
        .send(testUser)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.be.an('object');
          done();
        });
    });

    // Test case for existing user (conflict)
    it('POST /signup - returns error when user already exists', (done) => {
      // Reuse the same user created in the previous test
      chai.request(app)
        .post('/signup')
        .send(testUser)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message').that.is.oneOf([
            'Email already taken',
            'Username already taken',
            'Email and Username already taken',
          ]);
          done();
        });
    });

    // Test case for missing fields (username, email, or password)
    it('POST /signup - returns error when a required field is missing', (done) => {
      const missingUsername = { email: 'test@example.com', password: 'password123' };
      const missingEmail = { username: 'newuser', password: 'password123' };
      const missingPassword = { username: 'newuser', email: 'test@example.com' };

      // Test missing username
      chai.request(app)
        .post('/signup')
        .send(missingUsername)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'All fields are required');

          // Test missing email
          chai.request(app)
            .post('/signup')
            .send(missingEmail)
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('success', false);
              expect(res.body).to.have.property('message', 'All fields are required');

              // Test missing password
              chai.request(app)
                .post('/signup')
                .send(missingPassword)
                .end((err, res) => {
                  expect(res).to.have.status(400);
                  expect(res.body).to.be.an('object');
                  expect(res.body).to.have.property('success', false);
                  expect(res.body).to.have.property('message', 'All fields are required');
                  done();
                });
            });
        });
    });
  });

      
});
