import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';

let app: AppServer;
let server: Server;

describe('Server API', () => {
  beforeAll(() => {
    const setup = setupTests();
    app = setup.app;
    server = setup.server;
  });

  it('/health', done => {
    supertest(server)
      .get('/health')
      .expect(204, {}, done);
  });

  it('/health/metrics', done => {
    supertest(server)
      .get('/health/metrics')
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('freeMemory');
        expect(response.body.data).toHaveProperty('platform');
        expect(response.body.data).toHaveProperty('uptime');
      })
      .expect(200, done);
  });

  afterAll(done => {
    app.closeServer().then(done);
  });
});
