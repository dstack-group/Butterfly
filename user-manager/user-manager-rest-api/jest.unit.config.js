const config = require('./jest.config');
const unitConfig = {
  ...config,
  testMatch: [
    '<rootDir>/test/unit/**/*.spec.(ts|js)',
  ],
};

module.exports = unitConfig;
