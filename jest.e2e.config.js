// jest.config.js or jest.e2e.config.js
module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['**/?(*.)+(e2e).(j|t)s?(x)'],
  testTimeout: 10000,
};
