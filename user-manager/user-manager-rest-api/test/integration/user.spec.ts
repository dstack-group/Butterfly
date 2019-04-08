import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';
import { truncData } from '../fixtures/truncData';
import { PgDatabaseConnection } from '../../src/database';
import { createUsers, createUser } from '../fixtures/createUsers';
import { isValidDate } from '../isValidDate';

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

describe(`GET /users`, () => {
  it(`The response data should be ordered by id and match the objects inserted into the database`, done => {
    const { transaction, results } = createUsers(databaseConnection);
    transaction
      .then(_ => {
        supertest(server)
          .get('/users')
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

  it(`The response data should be an empty array if no user is saved`, done => {
    supertest(server)
      .get('/users')
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual([]);
      })
      .expect(200, done);
  });
});

describe(`POST /users`, () => {
  it(`Should fail if another user with the same email address already exists`, done => {
    const { transaction, result } = createUser(databaseConnection);
    const { email } = result;
    const user = {
      email,
      firstname: 'NEW_USER',
      lastname: 'NEW_USER',
    };
    transaction
      .then(_ => {
        supertest(server)
          .post('/users')
          .send(user)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(true);
          })
          .expect(409, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should return the newly inserted user if the INSERT operation is successful`, done => {
    const user = {
      email: 'email@email.com',
      firstname: 'NEW_USER',
      lastname: 'NEW_USER',
    };
    supertest(server)
      .post('/users')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject({
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          enabled: true,
          modified: null,
        });

        /**
         * data.created must be a valid date.
         */
        expect(response.body.data).toHaveProperty('created');
        expect(isValidDate(response.body.data.created)).toBe(true);

        /**
         * data.userId should be of type string.
         */
        expect(response.body.data).toHaveProperty('userId');
        expect(typeof response.body.data.userId).toBe('string');
      })
    .expect(201, done);
  });
});
