const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const { app, connectDB, closeDB } = require('../app');
const User = require('../models/User');

let token;

test.before(async () => {
  await connectDB();
  await User.deleteMany({});
});

test.after(async () => {
  await User.deleteMany({});
  await closeDB();
});

test('signup creates a user with a hashed password', async () => {
  const res = await request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Alice Test',
      email: 'alice@example.com',
      password: 'Password123!'
    });

  assert.equal(res.status, 201);
  assert.ok(res.body.user);
  assert.equal(res.body.user.email, 'alice@example.com');
  assert.notEqual(res.body.user.password, 'Password123!');
  token = res.body.token;
});

test('login returns a JWT for valid credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'alice@example.com',
      password: 'Password123!'
    });

  assert.equal(res.status, 200);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, 'alice@example.com');
});

test('protected route accepts a valid token and rejects missing/invalid ones', async () => {
  const validRequest = await request(app)
    .get('/api/protected')
    .set('Authorization', `Bearer ${token}`);

  const missingTokenRequest = await request(app).get('/api/protected');
  const invalidTokenRequest = await request(app)
    .get('/api/protected')
    .set('Authorization', 'Bearer invalid.token.here');

  assert.equal(validRequest.status, 200);
  assert.equal(missingTokenRequest.status, 401);
  assert.match(missingTokenRequest.body.message, /token|unauthorized/i);
  assert.equal(invalidTokenRequest.status, 401);
  assert.match(invalidTokenRequest.body.message, /invalid|unauthorized/i);
});
