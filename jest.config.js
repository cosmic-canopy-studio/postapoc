module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageReporters: ["lcov"],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1"
  },
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"]
};
