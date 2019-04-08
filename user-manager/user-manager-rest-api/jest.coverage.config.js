const config = require('./jest.config');
const coverageConfig = {
  ...config,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

module.exports = coverageConfig;
