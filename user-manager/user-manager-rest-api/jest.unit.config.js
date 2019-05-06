/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  jest.unit.config.js
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
const unitConfig = {
  ...config,
  testMatch: [
    '<rootDir>/test/unit/**/*.spec.(ts|js)',
  ],
};

module.exports = unitConfig;
