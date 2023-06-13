const request = require('supertest');

const app = require('../../src/app');

describe('GET /fragments/:id', () => {
  // test('returns the fragment with the specified id', async () => {
  //   const postRes = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user1@email.com', 'password1')
  //     .set('content-type', 'text/plain')
  //     .send('this is data');

  //   const fragmentFormat = {
  //     id: expect.any(String),
  //     ownerId: expect.any(String),
  //     created: expect.any(String),
  //     updated: expect.any(String),
  //     type: expect.any(String),
  //     // size: expect.any(Number),
  //   };
  //   const fragmentId = postRes.body.fragment.id; // Replace with an existing fragment id
  //   const res = await request(app).get(`/fragments/${fragmentId}`); // Replace with the expected status code

  //   // Add assertions to check the response body
  //   expect(res.body.fragment).toMatchObject(fragmentFormat);
  //   // Add more assertions as needed
  // });

  test('returns 404 if id is not found', async () => {
    const res = await request(app).get('/fragments/30a84843-0cd4-4975-95ba-b96112aea189');

    expect(res.statusCode).toBe(404);
  });
});
