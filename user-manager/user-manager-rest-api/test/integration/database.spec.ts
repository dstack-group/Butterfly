/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  database.spec.ts
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

describe(`Database connection`, () => {
  it(`Should connect to the test database if the server is properly setup`, done => {
    const { app } = setupTests();

    app.isConnectedToDatabase()
      .then(connected => {
        expect(connected).toBe(true);
      })
      .finally(() => {
        app.closeServer().then(done);
      });
  });

  /*
  TODO: setup a different test command that invokes only this that doesn't launch docker-compose with Postgres
  it(`Shouldn't be able to connect to the test database if the server isn't setup`, done => {
    const { app } = setupTests();

    app.isConnectedToDatabase()
      .then(connected => {
        expect(connected).toBe(false);
      })
      .finally(() => {
        app.closeServer().then(done);
      });
  });
  */
});
