module.exports = {
  // rootDir: `${__dirname}`,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
		'<rootDir>/test/**/*.spec.(ts|js)'
  ],
  setupFilesAfterEnv: ['<rootDir>/test/init.ts'],
};
