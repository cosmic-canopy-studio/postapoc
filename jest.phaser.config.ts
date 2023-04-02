// jest.phaser.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';
import jestConfig from './jest.config';

const jestPhaserConfig: JestConfigWithTsJest = {
  ...jestConfig,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/phaser/**.test.ts'],
  setupFiles: ['<rootDir>/tests/phaser/phaser.setup.js'],
};

export default jestPhaserConfig;
