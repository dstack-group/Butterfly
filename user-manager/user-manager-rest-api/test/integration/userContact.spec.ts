import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';
import { truncData } from '../fixtures/truncData';
import { PgDatabaseConnection } from '../../src/database';
import { createUser } from '../fixtures/createUsers';
import { createUserContact } from '../fixtures/createUserContacts';
import { ThirdPartyContactService } from '../../src/common/ThirdPartyContactService';

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

describe(`POST /users/:userEmail/contacts/:contactService`, () => {
  it(`Should fail if the given contactService is already linked to the given user`, done => {
    const {
      transaction: createUserTransaction,
      result: userResult,
    } = createUser(databaseConnection);

    const { email: userEmail } = userResult;

    const createUserContactParams = {
      contactRef: 'CONTACT_REF',
      contactService: ThirdPartyContactService.TELEGRAM,
      userEmail,
    };

    const {
      transaction: createUserContactTransaction,
      result: userContactResult,
    } = createUserContact(databaseConnection, createUserContactParams);

    const endpoint = `/users/${createUserContactParams.userEmail}/contacts/${createUserContactParams.contactService}`;

    createUserTransaction
      .then(async () => await createUserContactTransaction)
      .then(() => {
        supertest(server)
          .post(endpoint)
          .send(userContactResult)
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
});

describe(`DELETE /users/:userEmail/contacts/:contactService`, () => {
  it(`Should delete a user contact if it exists`, done => {
    const {
      transaction: createUserTransaction,
      result: userResult,
    } = createUser(databaseConnection);

    const { email: userEmail } = userResult;

    const createUserContactParams = {
      contactRef: 'CONTACT_REF',
      contactService: ThirdPartyContactService.TELEGRAM,
      userEmail,
    };

    const {
      transaction: createUserContactTransaction,
    } = createUserContact(databaseConnection, createUserContactParams);

    const endpoint = `/users/${createUserContactParams.userEmail}/contacts/${createUserContactParams.contactService}`;

    createUserTransaction
      .then(async () => await createUserContactTransaction)
      .then(() => {
        supertest(server)
          .delete(endpoint)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toBe(null);
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should return a NotFoundError if attempting to delete a user contact that doesn't exist
      linked to a user that exists`, done => {
    const {
      transaction: createUserTransaction,
      result: userResult,
    } = createUser(databaseConnection);

    const endpoint = `/users/${userResult.email}/contacts/${ThirdPartyContactService.TELEGRAM}`;

    createUserTransaction
      .then(() => {
        supertest(server)
        .delete(endpoint)
        .expect('Content-Type', /application\/json/)
        .expect(response => {
          expect(response.body).not.toHaveProperty('data');
          expect(response.body).toHaveProperty('error');
          expect(response.body.error).toBe(true);
        })
        .expect(404, done);
      });
  });
});
