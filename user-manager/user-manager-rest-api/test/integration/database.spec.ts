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
import { TestConfigManager } from '../TestConfigManager';

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

  it(`Shouldn't be able to connect to the test database if the server isn't setup`, done => {
    const configManager = new TestConfigManager();
    configManager.setProperty('APP_NAME', 'user-manager-rest-api');
    configManager.setProperty('APP_HOST', 'localhost');
    configManager.setProperty('APP_PORT', '5000');
    configManager.setProperty('DATABASE_HOST', 'postgres-test');
    configManager.setProperty('DATABASE_USER', 'NOT_EXISTING_USER');
    configManager.setProperty('DATABASE_NAME', 'butterfly');
    configManager.setProperty('DATABASE_PASSWORD', 'butterfly_user');
    configManager.setProperty('DATABASE_PORT', '5432');

    const { app } = setupTests(configManager);

    app.isConnectedToDatabase()
      .then(connected => {
        expect(connected).toBe(false);
      })
      .finally(() => {
        app.closeServer().then(done);
      });
  });
});
