const request = require('supertest');

const app = require('../../src/app');
require('dotenv').config();

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('this is data');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    const fragmentFormat = {
      id: expect.any(String),
      ownerId: expect.any(String),
      created: expect.any(String),
      updated: expect.any(String),
      type: expect.any(String),
      // size: expect.any(Number),
    };
    expect(res.body.fragment).toMatchObject(fragmentFormat);
  });

  test('unsupported type leads to failure', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'application/json')
      .send({ fragment: 'fragment' });
    expect(res.statusCode).toBe(415);
  });

  // test('fragment without data does not work', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user1@email.com', 'password1')
  //     .send();
  //   expect(res.statusCode).toBe(500);
  // });
});
