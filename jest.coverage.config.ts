// jest.coverage.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';
import jestConfig from './jest.config';

const jestCoverageConfig: JestConfigWithTsJest = {
  ...jestConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/core/**/*.ts',
    '<rootDir>/src/ecs/**/*.ts',
  ],
  coveragePathIgnorePatterns: [
    '\\.json$',
    'inversify.config.ts',
    'debugPanel.ts',
  ],
  coverageReporters: ['lcov'],
};

export default jestCoverageConfig;
