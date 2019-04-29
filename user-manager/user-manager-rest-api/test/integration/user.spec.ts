/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  user.spec.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import 'jest';
import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';
import { truncData } from '../fixtures/truncData';
import { PgDatabaseConnection } from '../../src/database';
import { createUsers, createUser } from '../fixtures/createUsers';
import { isValidDate } from '../isValidDate';
import { User, CreateUser } from '../../src/modules/users/entity';

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
      .then(() => {
        supertest(server)
          .get('/users')
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data.length).toBe(results.length);
            (response.body.data as User[]).forEach((obj, i) => {
              const currentResult = results[i];
              expect(obj).toMatchObject(currentResult);

              /**
               * data.created must be a valid date.
               */
              expect(obj).toHaveProperty('created');
              expect(isValidDate(obj.created)).toBe(true);

              /**
               * data.modified must not be set.
               */
              expect(obj).toHaveProperty('modified');
              expect(obj.modified).toBe(null);
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
    const user: CreateUser = {
      email,
      firstname: 'NEW_USER',
      lastname: 'NEW_USER',
    };

    transaction
      .then(() => {
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
    const user: CreateUser = {
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
          enabled: true,
          firstname: user.firstname,
          lastname: user.lastname,
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

describe(`GET /users/:email`, () => {
  it(`Should return the user record if the given email belongs to a user`, done => {
    const { transaction, result } = createUser(databaseConnection);
    const { email } = result;
    const endpoint = `/users/${email}`;
    transaction
      .then(() => {
        supertest(server)
          .get(endpoint)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
              ...result,
            });

            /**
             * data.created must be a valid date.
             */
            expect(response.body.data).toHaveProperty('created');
            expect(isValidDate(response.body.data.created)).toBe(true);

            /**
             * data.modified must not be set.
             */
            expect(response.body.data).toHaveProperty('modified');
            expect(response.body.data.modified).toBe(null);
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should return a NotFound error if no user exists with the given email`, done => {
    supertest(server)
      .get('/users/RANDOM_EMAIL@email.com')
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('error');
      })
      .expect(404, done);
  });
});

describe(`PATCH /users/:email`, () => {
  it(`Should update a user only if some record property changed`, done => {
    const { transaction, result } = createUser(databaseConnection);
    const { email, enabled, firstname, lastname } = result;
    const userPayload = {
      email,
      enabled,
      firstname,
      lastname,
    };

    transaction
      .then(() => {
        supertest(server)
          .patch(`/users/${email}`)
          .send(userPayload)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
              ...result,
            });

            /**
             * data.created must be a valid date.
             */
            expect(response.body.data).toHaveProperty('created');
            expect(isValidDate(response.body.data.created)).toBe(true);

            /**
             * data.modified must not be set.
             */
            expect(response.body.data).toHaveProperty('modified');
            expect(response.body.data.modified).toBe(null);

            /**
             * data.projectId should be of type string.
             */
            expect(response.body.data).toHaveProperty('userId');
            expect(typeof response.body.data.userId).toBe('string');
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should update a user if at least the firstname field is changed`, done => {
    const { transaction, result } = createUser(databaseConnection);
    const { email, enabled, lastname } = result;
    const userPayload = {
      email,
      enabled,
      firstname: 'NEW_FIRSTNAME',
      lastname,
    };

    transaction
      .then(() => {
        supertest(server)
          .patch(`/users/${email}`)
          .send(userPayload)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
              ...result,
              ...userPayload,
            });

            /**
             * data.created must be a valid date.
             */
            expect(response.body.data).toHaveProperty('created');
            expect(isValidDate(response.body.data.created)).toBe(true);

            /**
             * data.modified must be a valid date.
             */
            expect(response.body.data).toHaveProperty('modified');
            expect(isValidDate(response.body.data.modified)).toBe(true);

            /**
             * data.projectId should be of type string.
             */
            expect(response.body.data).toHaveProperty('userId');
            expect(typeof response.body.data.userId).toBe('string');
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should update a user if at least the lastname field is changed`, done => {
    const { transaction, result } = createUser(databaseConnection);
    const { email, enabled, firstname } = result;
    const userPayload = {
      email,
      enabled,
      firstname,
      lastname: 'NEW_LASTNAME',
    };

    transaction
      .then(() => {
        supertest(server)
          .patch(`/users/${email}`)
          .send(userPayload)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
              ...result,
              ...userPayload,
            });

            /**
             * data.created must be a valid date.
             */
            expect(response.body.data).toHaveProperty('created');
            expect(isValidDate(response.body.data.created)).toBe(true);

            /**
             * data.modified must be a valid date.
             */
            expect(response.body.data).toHaveProperty('modified');
            expect(isValidDate(response.body.data.modified)).toBe(true);

            /**
             * data.projectId should be of type string.
             */
            expect(response.body.data).toHaveProperty('userId');
            expect(typeof response.body.data.userId).toBe('string');
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should update a user if at least the enabled field is changed`, done => {
    const { transaction, result } = createUser(databaseConnection);
    const { email, enabled, firstname, lastname } = result;
    const userPayload = {
      email,
      enabled: !enabled,
      firstname,
      lastname,
    };

    transaction
      .then(() => {
        supertest(server)
          .patch(`/users/${email}`)
          .send(userPayload)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
              ...result,
              ...userPayload,
            });

            /**
             * data.created must be a valid date.
             */
            expect(response.body.data).toHaveProperty('created');
            expect(isValidDate(response.body.data.created)).toBe(true);

            /**
             * data.modified must be a valid date.
             */
            expect(response.body.data).toHaveProperty('modified');
            expect(isValidDate(response.body.data.modified)).toBe(true);

            /**
             * data.projectId should be of type string.
             */
            expect(response.body.data).toHaveProperty('userId');
            expect(typeof response.body.data.userId).toBe('string');
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should update a user even if some optional properties aren't specified`, done => {
    const { transaction, result } = createUser(databaseConnection);
    const { email } = result;
    const userPayload = {
      email,
      firstname: 'NEW_FIRSTNAME',
    };

    transaction
      .then(() => {
        supertest(server)
          .patch(`/users/${email}`)
          .send(userPayload)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
              ...result,
              firstname: userPayload.firstname,
            });

            /**
             * data.created must be a valid date.
             */
            expect(response.body.data).toHaveProperty('created');
            expect(isValidDate(response.body.data.created)).toBe(true);

            /**
             * data.modified must be set a valid date.
             */
            expect(response.body.data).toHaveProperty('modified');
            expect(isValidDate(response.body.data.modified)).toBe(true);

            /**
             * data.projectId should be of type string.
             */
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

describe(`DELETE /users`, () => {
  it(`Should delete a user if it exists`, done => {
    const { transaction, result } = createUser(databaseConnection);
    const { email } = result;

    transaction
      .then(() => {
        supertest(server)
          .delete(`/users/${email}`)
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

  it(`Should return a NotFoundError if attempting to delete a user that doesn't exist`, done => {
    supertest(server)
      .delete(`/users/PROJECT_NAME`)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(true);
      })
      .expect(404, done);
  });
});
