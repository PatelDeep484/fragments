const request = require('supertest');

const app = require('../../src/app');

describe('GET /fragments/:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/111/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('returns 401 if the user is not authenticated', () =>
    request(app)
      .get('/v1/fragments/111/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result
  test('returns the metadata for the existing fragment with the specified id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');
    const id = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
  });
  test('authenticated users get fragment data with the given id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(postRes.text).fragment.id;
    const fragment = JSON.parse(postRes.text).fragment;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragment).toEqual(fragment);
  });
  // Returns 404 if the fragment does not exist
  test('returns 404 if no fragment exists with the specified id', async () => {
    const nonExistingFragmentId = '1234567890';

    const res = await request(app)
      .get(`/v1/fragments/${nonExistingFragmentId}/info`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(404);
    expect(res.body.error.message).toBe('Fragment not found');
  });
});
