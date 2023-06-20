const request = require('supertest');

const app = require('../../src/app');

describe('GET /fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/007').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/007')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('returns the fragment with the specified id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');

    const fragmentId = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
  });

  test('returns 404 if id is not found', async () => {
    const res = await request(app).get('/fragments/30a84843-0cd4-4975-95ba-b96112aea189');

    expect(res.statusCode).toBe(404);
  });
});
