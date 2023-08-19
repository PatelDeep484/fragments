const request = require('supertest');
const app = require('../../src/app');
describe('PUT /v1/fragments', () => {
  test('unauthenticated request', () => request(app).put('/v1/fragments/random').expect(401));
  test('incorrect details', () =>
    request(app)
      .put('/v1/fragments/random')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users updating a frsg', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(postRes.text).fragment.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is updated fragment');
    const body = JSON.parse(putRes.text);
    expect(putRes.statusCode).toBe(201);
    expect(body.status).toBe('ok');
    expect(body.fragment.type).toMatch(/text\/plain+/);
    expect(body.fragment.size).toEqual(24);
    const fragment = JSON.parse(putRes.text).fragment;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user2@email.com', 'password2');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.status).toBe('ok');
    expect(getRes.body.fragment).toEqual(fragment);
  });

  test('no id found', async () => {
    const putRes = await request(app)
      .put('/v1/fragments/random')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('this is new frag');
    expect(putRes.statusCode).toBe(500);
  });

  test('authenticated users creating frag', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    const id = JSON.parse(postRes.text).fragment.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/markdown')
      .send('this is new frag');
    expect(putRes.statusCode).toBe(400);
  });
});
