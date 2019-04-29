/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  jest.ci.config.js
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
const unitConfig = require('./jest.unit.config');
const integrationConfig = require('./jest.integration.config');
// const coverageConfig = require('./jest.coverage.config');

const testMatches = [
  unitConfig.testMatch[0],
  integrationConfig.testMatch[0],
];

const ciConfig = {
  ...config,
  // ...coverageConfig.coverageThreshold,
  testMatch: testMatches,
};

module.exports = ciConfig;
