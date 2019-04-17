import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';
import { truncData } from '../fixtures/truncData';
import { PgDatabaseConnection } from '../../src/database';
// import { createSearchReceivers } from '../fixtures/createSearches';
import { Event, ServiceEventType } from '../../src/common/Event';
import { ThirdPartyProducerService } from '../../src/common/ThirdPartyProducerService';

let app: AppServer;
let server: Server;
let databaseConnection: PgDatabaseConnection;

/**
 * Spins up a new HTTP server and a new database connection before each test executes.
 * It also removes the database rows every time, ensuring that the only things left definted
 * in the database are tables, functions, procedures and views.
 */
beforeEach(done => {
  const setup = setupTests();
  app = setup.app;
  server = setup.server;
  databaseConnection = setup.databaseConnection;
  truncData(databaseConnection).then(done);
});

afterEach(done => {
  app.closeServer().then(done);
});

describe(`POST /search/receivers`, () => {
  /*
  it(`Should return only those users which are interested in the content of the event
      concerning the particular event type and project cited in the event record`, done => {
    const { transaction, event, results } = initializeSearchReceiversData(databaseConnection);
    transaction
      .then(() => {
        supertest(server)
          .post('/search/receivers')
          .send(event)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data.length).toBe(results.length);
            (response.body.data as unknown[]).forEach((obj, i) => {
              const currentResult = results[i];
              expect(obj).toMatchObject(currentResult);
              expect(obj).toHaveProperty('created');
            });
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });
  */

  /*
 public.producer_service 'GITLAB' AS service,
 'Amazon' AS project_name,
 'gitlab.amazon.com/amazon/amazon.git' AS project_url,
 1 AS event_id,
 public.service_event_type 'GITLAB_ISSUE_CREATED' AS event_type,
 'federico.rispo@gmail.com' AS user_email,
 'New performance bug for you' AS title,
 'Random and pretty long description that discusses about the importance of writing clean and performance-wise code. Something must be fixed.' AS description,
 array['bug', 'revert']::text[] AS tags
*/

  it(`The response data should be an empty array if no subscription is saved`, done => {
    const event: Event = {
      // tslint:disable-next-line: max-line-length
      description: 'Random and pretty long description that discusses about the importance of writing clean and performance-wise code. Something must be fixed.',
      eventId: '1',
      eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
      projectName: 'Amazon',
      projectURL: 'gitlab.amazon.com/amazon/amazon.git',
      service: ThirdPartyProducerService.GITLAB,
      tags: ['bug', 'revert'],
      timestamp: new Date(),
      title: 'New performance bug for you',
      userEmail: 'federico.rispo@gmail.com',
    };
    supertest(server)
      .post('/search/receivers')
      .send(event)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual([]);
      })
      .expect(200, done);
  });
});
