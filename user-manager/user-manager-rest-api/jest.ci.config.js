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
