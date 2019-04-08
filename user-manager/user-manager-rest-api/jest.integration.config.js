const config = require('./jest.config');
const integrationConfig = {
  ...config,
  testMatch: [
    '<rootDir>/test/integration/**/*.spec.(ts|js)',
  ],
};

module.exports = integrationConfig;
