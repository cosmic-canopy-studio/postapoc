export default {
  collectCoverage: false,

  collectCoverageFrom: ['./src/**'],

  coverageProvider: 'v8',

  coverageDirectory: './test/coverage/',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    }
  },
  moduleFileExtensions: ['feature', 'js', 'json', 'ts', 'tsx'],
  testMatch: [
    //'**/test/**/*.+(ts|tsx|js)',
    '**/test/**/?(*.)+(spec|test|steps).+(ts|tsx|js)'
    //'**/test/**/*.feature'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
