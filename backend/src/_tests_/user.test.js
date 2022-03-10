const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');
const {mock} = require('nodemailer');
const testData = require('./test_data/new_users.json');

let server;

const newUsers1 = testData.newusers1;
const newUsers2 = testData.newusers2;
const activeUsers = testData.activeUsers;
const verificationUsers = testData.verificationUsers;
const passwordResetUsers = testData.passwordResetUsers;
const incorrectPassword = (Math.random() + 1).toString(36).substring(7);

beforeAll(() => {
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

describe('Test user-creation', () => {
  test('Invalid email format', async () => {
    const badEmails = ['cse183-studentucsc.com',
      'student@ucscedu', 'cse183-student@ucsc.',
      'cse183-student@.net', 'cse183-student@.', '@ucsc.edu'];
    const info = {
      'username': 'csestudent',
      'email': '',
      'password': 'password1',
    };
    for (email of badEmails) {
      info.email = email;
      await request.post('/v0/user').send(info)
        .expect(400);
    }
  });
  test('Missing a password', async () => {
    const info = {
      'username': 'baller21',
      'email': 'bgallanders0@youtube.com',
    };
    await request.post('/v0/user').send(info)
      .expect(400);
  });
  test('Missing username', async () => {
    const info = {
      'email': 'testmail12@test.com',
      'password': 'password1',
    };

    await request.post('/v0/user').send(info)
      .expect(400);
  });
  test('Extra properties', async () => {
    const info = {
      'email': 'testil12@test.com',
      'password': 'password1',
      'username': 'invalid',
      'extra': 'test',
    };

    await request.post('/v0/user').send(info)
      .expect(400);
  });
  test('Email is already in use', async () => {
    const info = {
      'email': 'bgallanders0@youtube.com',
      'password': 'password1',
      'username': 'newUser',
    };
    await request.post('/v0/user').send(info)
      .expect(409);
  });
  test('Username is already in use', async () => {
    const info = {
      'email': 'newemail0@youtube.com',
      'password': 'password1',
      'username': 'steff808',
    };
    await request.post('/v0/user').send(info)
      .expect(409);
  });
  test('Password length < 5', async () => {
    const info = {
      'email': 'testmail12@test.com',
      'password': 'pass',
      'username': 'unique12',
    };
    await request.post('/v0/user').send(info)
      .expect(400);
  });
  test('New valid account. 201 status code.', async () => {
    const info = {
      'email': 'testmail12@test.com',
      'password': 'password1',
      'username': 'unique12',
    };
    const result = await request.post('/v0/user').send(info)
      .expect(201);
    console.log(result.body);
  });
  test('User is sent an email upon account creation', async () => {
    for (const user of newUsers2 ) {
      mock.reset();
      const result = await request.post('/v0/user').send(user);
      expect(result.body.active).toBe(false);
      const sentEmail = mock.getSentMail();
      expect(sentEmail[0].to).toBe(user.email);
      expect(sentEmail[0].subject)
        .toContain('[MealPrep]- Please confirm your Email account!');
    }
  });
});

describe('Test user log-in', () => {
  test('Log-in attempt with no email or username', async () => {
    const rand = Math.floor(Math.random() * newUsers2.length);
    const randomUser = {...newUsers2[rand]};
    randomUser.email = null;
    randomUser.username = null;
    await request.post('/login').send(randomUser)
      .expect(400);
  });
  test('Log-in attempt with no password', async () => {
    const rand = Math.floor(Math.random() * newUsers1.length);
    const randomUser = {...newUsers1[rand]};
    randomUser.password = null;
    await request.post('/login').send(randomUser)
      .expect(400);
  });
  test('Valid email with incorrect password', async () => {
    for (const user of newUsers1) {
      const userInfo = {
        'password': incorrectPassword,
        'username': null,
        'email': user.email,
      };
      await request.post('/login').send(userInfo)
        .expect(401);
    }
  });
  test('Valid username with incorrect password', async () => {
    for (const user of newUsers2) {
      const userInfo = {
        'password': incorrectPassword,
        'username': user.username,
        'email': null,
      };
      await request.post('/login').send(userInfo)
        .expect(401);
    }
  });
  test('Login for an account that has not been activated', async () => {
    for (const user of newUsers2) {
      const userInfo= {'email': null, ...user};
      await request.post('/login').send(userInfo)
        .expect(403);
    }
  });
  test('Valid log-in with username with active account', async () => {
    for (const user of activeUsers) {
      const userInfo= {'email': null, ...user};
      const response = await request.post('/login').send(userInfo);
      expect(response.body.email).toBe(user.email);
      expect(response.body.id).toBeDefined();
      expect(response.body.username).toBe(user.username);
    }
  });
  test('Valid log-in with email with active account', async () => {
    for (const user of activeUsers) {
      const userInfo= {'username': null, ...user};
      const response = await request.post('/login').send(userInfo);
      expect(response.body.email).toBe(user.email);
      expect(response.body.id).toBeDefined();
      expect(response.body.username).toBe(user.username);
    }
  });
});

describe('New Account Verification', () => {
  test('Invalid tokin for account verification', async () => {
    for (const user of verificationUsers) {
      await request.post('/verify').send({token: user.email})
        .expect(403);
    }
  });
  test('Successful account verification', async () => {
    for (const user of verificationUsers) {
      const response = await request.post('/verify').send({token: user.token});
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(user.email);
      expect(response.body.isActivated).toBe(true);
    }
  });
  test('Attempting to verify account that is already activated', async () => {
    for (const user of verificationUsers) {
      await request.post('/verify').send({token: user.token})
        .expect(409);
    }
  });
});

describe('Account Password Reset', ()=> {
  test('Invalid tokin for password rest', async () => {
    for (const user of passwordResetUsers) {
      await request.post('/resetPassword').send({token: user.password})
        .expect(403);
    }
  });
  test('Successful password reset', async () => {
    for (const user of passwordResetUsers) {
      const result = await request.post('/resetPassword')
        .send({token: user.token, password: 'password2'});
      expect(result.status).toBe(200);
      expect(result.body.email).toBe(user.email);
    }
  });
  test('Login after password reset', async () => {
    for (const user of passwordResetUsers) {
      await request.post('/login')
        .send({email: user.email, password: 'password2'})
        .expect(200);
    }
  });
  test('Attempting to reset password with old token', async () => {
    for (const user of passwordResetUsers) {
      await request.post('/resetPassword')
        .send({token: user.token, password: 'password3'})
        .expect(403);
    }
  });
});

