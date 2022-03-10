/* eslint-disable max-len */
const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');
const {mock} = require('nodemailer');
const testData = require('./test_data/new_users.json');


let server;

const nonExistentUsers = testData.newusers2;
const activeUsers = testData.activeUsers;

const inactiveUsers = testData.inactiveUsers;


beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

beforeEach(()=>{
  mock.reset();
});
describe('Testing endpoint to request another verification email', () => {
  test('Non-existent email requesting server to resend verification email', async () => {
    for (const notUser of nonExistentUsers) {
      await request.post('/resend_verification').send({email: notUser.email})
        .expect(404);
    }
    const allSentmail = mock.getSentMail();
    expect(allSentmail.length).toBe(0);
  });
  test('Valid user requesting server to resend verification', async () => {
    for (const user of inactiveUsers ) {
      mock.reset();
      await request.post('/resend_verification').send({email: user.email})
        .expect(200);
      const sentEmail = mock.getSentMail();
      expect(sentEmail[0].to).toBe(user.email);
      expect(sentEmail[0].subject)
        .toContain('[MealPrep]- Please confirm your Email account!');
    }
  });
});

describe('Testing endpoint for forgot password ', () => {
  test('Non-existent email requesting forgot password', async () => {
    for (const notUser of nonExistentUsers) {
      await request.post('/forgotPassword').send({email: notUser.email})
        .expect(404);
    }
    const allSentmail = mock.getSentMail();
    expect(allSentmail.length).toBe(0);
  });
  test('Valid user requesting forgot password', async () => {
    for (const user of activeUsers ) {
      mock.reset();
      await request.post('/forgotPassword').send({email: user.email})
        .expect(200);
      const sentEmail = mock.getSentMail();
      expect(sentEmail[0].to).toBe(user.email);
      expect(sentEmail[0].subject)
        .toContain('[MealPrep]- Reset your account\'s password!');
    }
  });
});


