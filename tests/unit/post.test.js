const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied / 401', () =>
    request(app).post('/v1/fragments').expect(401));

  test('incorrect inputs are denied/ 401', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  test('unsupported type gives 415 error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'application/json')
      .send({ fragment: 'fragment' });
    expect(res.statusCode).toBe(415);
  });
});
