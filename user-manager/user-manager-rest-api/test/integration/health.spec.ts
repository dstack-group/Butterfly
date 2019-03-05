import { app, server } from '../../src/index';
import supertest from 'supertest';

describe('Server API', () => {
  it('/health', async () => {
    const response = await supertest(server)
      .get('/health');

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('/health/metrics', async () => {
    const response = await supertest(server)
      .get('/health/metrics');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('freeMemory');
    expect(response.body.data).toHaveProperty('platform');
    expect(response.body.data).toHaveProperty('uptime');
  });

  afterAll(async () => {
    await app.closeServer();
  }, 10000);
});
