import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';
import { TestMetricsProvider } from '../TestMetricsProvider';

let app: AppServer;
let server: Server;

describe(`REST API: health module`, () => {
  /**
   * Spins up a new HTTP server and a new database connection before each test executes.
   * It also removes the database rows every time, ensuring that the only things left definted
   * in the database are tables, functions, procedures and views.
   */
  beforeEach(() => {
    const setup = setupTests();
    app = setup.app;
    server = setup.server;
  });

  /**
   * Closes the current HTTP server and releases every resource allocated by it.
   */
  afterEach(done => {
    app.closeServer().then(done);
  });

  it(`/health`, done => {
    supertest(server)
      .get('/health')
      .expect(204, {}, done);
  });

  it(`/health/metrics`, done => {
    const testMetricsProvider = new TestMetricsProvider();
    supertest(server)
      .get('/health/metrics')
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('freeMemory');
        expect(response.body.data).toHaveProperty('platform');
        expect(response.body.data).toHaveProperty('uptime');
        expect(response.body).toEqual({
          data: {
            freeMemory: testMetricsProvider.getFreeMemory(),
            platform: testMetricsProvider.getPlatform(),
            uptime: testMetricsProvider.getUptime(),
          },
        });
      })
      .expect(200, done);
  });
});
