/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  userContact.spec.ts
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
import { PgDatabaseConnection, truncData } from '../../src/database';
import { createUser } from '../fixtures/createUsers';
import { createUserContact, createUserContacts } from '../fixtures/createUserContacts';
import { ThirdPartyContactService } from '../../src/common/ThirdPartyContactService';
import { UserContactInfo, ContactRef, CreateUserContactBody } from '../../src/modules/userContacts/entity';
import { ParseSyntaxError } from '../../src/errors';

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

describe(`GET /user-contacts/:userEmail`, () => {
  it(`The response data should match the contacts inserted into the database for the user
      associated with the given email`, async done => {
    const {
      transaction: createUserTransaction,
      result: userResult,
    } = createUser(databaseConnection);
    const { email: userEmail } = userResult;
    const endpoint = `/user-contacts/${userEmail}`;
    await createUserTransaction;

    const createUserContactTelegramParams = {
      contactRef: 'TELEGRAM_CONTACT_REF',
      contactService: ThirdPartyContactService.TELEGRAM,
      userEmail,
    };

    const createUserContactEmailParams = {
      contactRef: 'EMAIL_CONTACT_REF@email.com',
      contactService: ThirdPartyContactService.EMAIL,
      userEmail,
    };

    const createUserContactSlackParams = {
      contactRef: 'SLACK_CONTACT_REF',
      contactService: ThirdPartyContactService.SLACK,
      userEmail,
    };

    const { transaction: createUserContactsTransaction } = createUserContacts(databaseConnection, [
      createUserContactTelegramParams,
      createUserContactEmailParams,
      createUserContactSlackParams,
    ]);

    const result: UserContactInfo = {
      [ThirdPartyContactService.EMAIL]: createUserContactEmailParams.contactRef,
      [ThirdPartyContactService.SLACK]: createUserContactSlackParams.contactRef,
      [ThirdPartyContactService.TELEGRAM]: createUserContactTelegramParams.contactRef,
    };

    createUserContactsTransaction()
      .then(() => {
        supertest(server)
          .get(endpoint)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toEqual(result);
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  /*
  it(`The response data should be null if no user is saved`, done => {
    supertest(server)
      .get('/users')
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual([]);
      })
      .expect(200, done);
  });

  it(`Should return a NotFoundError if attempting to retrieve the list of user
      contacts of a non existing user`, done => {
    supertest(server)
      .get('/user-contacts/RANDOM_EMAIL@email.com')
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
      })
      .expect(404, done);
  });
  */
});

describe(`POST /user-contacts/:contactService`, () => {
  it(`Should return ParseSyntaxError if the body request isn't a valid JSON`, done => {
    const payload = '{"contactRef":"REF","userEmail"}';
    supertest(server)
      .post(`/user-contacts/${ThirdPartyContactService.TELEGRAM}`)
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body).toMatchObject(new ParseSyntaxError('body').toJSON());
      })
      .expect(400, done);
  });

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
    } = createUserContact(databaseConnection, createUserContactParams);

    const endpoint = `/user-contacts/${createUserContactParams.contactService}`;
    const payload: CreateUserContactBody = {
      contactRef: createUserContactParams.contactRef,
      userEmail,
    };

    createUserTransaction
      .then(async () => await createUserContactTransaction())
      .then(() => {
        supertest(server)
          .post(endpoint)
          .send(payload)
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

  it(`Should create a new user contact account if the given contactService isn't already linked to the
      existing user identified by the given email`, done => {
    const {
      transaction: createUserTransaction,
      result: userResult,
    } = createUser(databaseConnection);

    const { email: userEmail } = userResult;

    const createUserContactParams = {
      contactRef: 'CONTACT_REF@email.it',
      contactService: ThirdPartyContactService.EMAIL,
      userEmail,
    };
    const endpoint = `/user-contacts/${createUserContactParams.contactService}`;
    const userContactResult = {
      ...createUserContactParams,
    };

    const payload: CreateUserContactBody = {
      contactRef: createUserContactParams.contactRef,
      userEmail,
    };

    createUserTransaction
      .then(() => {
        supertest(server)
        .post(endpoint)
        .send(payload)
        .expect('Content-Type', /application\/json/)
        .expect(response => {
          expect(response.body).not.toHaveProperty('error');
          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toMatchObject(userContactResult);
          expect(response.body.data).toHaveProperty('userContactId');
          expect(typeof response.body.data.userContactId).toBe('string');
        })
        .expect(201, done);
      });
  });

  it(`Shouldn't create a new user contact account if the user doesn't exist yet`, done => {
    const userEmail = 'NON_EXISTING_EMAIL@email.com';
    const endpoint = `/user-contacts/${ThirdPartyContactService.EMAIL}`;
    const payload = {
      contactRef: 'CONTACT_REF@email.it',
      userEmail,
    };

    supertest(server)
      .post(endpoint)
      .send(payload)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(true);
      })
      .expect(500, done); // TODO: this should be 422
  });
});

describe(`PUT /user-contacts/:userEmail/:contactService`, () => {
  it(`Should return ParseSyntaxError if the body request isn't a valid JSON`, done => {
    const payload = '{"contactRef":}';
    const userEmail = 'asd@email.com';
    supertest(server)
      .put(`/user-contacts/${userEmail}/${ThirdPartyContactService.TELEGRAM}`)
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body).toMatchObject(new ParseSyntaxError('body').toJSON());
      })
      .expect(400, done);
  });

  it(`Should update an existing user contact account`, done => {
    const {
      transaction: createUserTransaction,
      result: userResult,
    } = createUser(databaseConnection);

    const { email: userEmail } = userResult;

    const createUserContactParams = {
      contactRef: 'CONTACT_REF',
      contactService: ThirdPartyContactService.SLACK,
      userEmail,
    };

    const {
      transaction: createUserContactTransaction,
      result: userContactResult,
    } = createUserContact(databaseConnection, createUserContactParams);

    const endpoint = `/user-contacts/${userEmail}/${createUserContactParams.contactService}`;
    const updateUserContactParams: ContactRef = {
      contactRef: 'NEW_CONTACT_REF',
    };

    createUserTransaction
      .then(async () => await createUserContactTransaction())
      .then(() => {
        supertest(server)
          .put(endpoint)
          .send(updateUserContactParams)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).not.toHaveProperty('error');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
              contactType: userContactResult.contactService,
              contactRef: updateUserContactParams.contactRef,
            });
            expect(response.body.data).toHaveProperty('userContactId');
            expect(typeof response.body.data.userContactId).toBe('string');
            expect(response.body.data).toHaveProperty('userId');
            expect(typeof response.body.data.userId).toBe('string');
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });
});

describe(`DELETE /user-contacts/:userEmail/:contactService`, () => {
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

    const endpoint = `/user-contacts/${createUserContactParams.userEmail}/${createUserContactParams.contactService}`;

    createUserTransaction
      .then(async () => await createUserContactTransaction())
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

    const endpoint = `/user-contacts/${userResult.email}/${ThirdPartyContactService.TELEGRAM}`;

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
