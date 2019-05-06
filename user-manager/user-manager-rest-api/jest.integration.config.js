/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  jest.integration.config.js
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

const config = require('./jest.config');
const integrationConfig = {
  ...config,
  testMatch: [
    '<rootDir>/test/integration/**/*.spec.(ts|js)',
  ],
};

module.exports = integrationConfig;
