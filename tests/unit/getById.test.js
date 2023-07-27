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
      .set('content-type', 'text/plain')
      .send('This is a fragment');

    const fragmentId = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('This is a fragment');
  });

  test('successful conversion of markdown(.md) extension to html', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/markdown')
      .send('# text');

    const fragmentId = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${fragmentId}.html`) // Requesting HTML conversion
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<h1>text</h1>');
  });

  test('returns 415 if requested extension is unsupported', async () => {
    const req = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown');

    const res = await request(app)
      .get(`/v1/fragments/${req.body.fragment.id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
  });
  test('returns 415 if requested extension is invalid', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');

    const fragmentId = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${fragmentId}.unsupported`) // Requesting unsupported extension
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(415);
  });
  test('returns 404 if id is not found', async () => {
    const res = await request(app)
      .get('/v1/fragments/30a84843-0cd4-4975-95ba-b96112aea189')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
  });
});
