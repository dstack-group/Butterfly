/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  search.spec.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';
import { truncData } from '../fixtures/truncData';
import { PgDatabaseConnection } from '../../src/database';
import { Event } from '../../src/common/Event';
import { createEvent, initializeSearchReceiversData } from '../fixtures/createSearchReceivers';

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
    const { transaction, event, result } = initializeSearchReceiversData(databaseConnection);
    transaction
      .then(() => {
        supertest(server)
          .post('/search/receivers')
          .send(event)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject(result);
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });
  */

  it(`The response data should be an empty array if no subscription is saved`, done => {
    const event: Event = createEvent();
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

  it(`Should return 201 if the parameter saveEvent is set to true`, done => {
    const event: Event = createEvent();
    supertest(server)
      .post('/search/receivers?saveEvent=true')
      .send(event)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual([]);
      })
      .expect(201, done);
  });
});
