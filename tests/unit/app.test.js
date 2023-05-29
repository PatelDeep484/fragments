const request = require('supertest');
const app = require('../../src/app');

describe('4Handling 404', () => {
  test('unknown routes should give 404 error', async () => {
    const response = await request(app).get('/routes');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
