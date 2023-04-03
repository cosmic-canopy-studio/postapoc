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
    moduleFileExtensions: ['feature', 'js', 'jsx', 'json', 'ts', 'tsx', 'node'],
    testMatch: ['**/test/**/?(*.)+(spec|test|steps).+(ts|tsx|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)?$': 'babel-jest'
    },
    setupFiles: ['jest-canvas-mock'],
    setupFilesAfterEnv: [
        '@testing-library/jest-dom',
        '@testing-library/jest-dom/extend-expect'
    ],
    testEnvironmentOptions: {
        url: 'http://localhost/'
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    testEnvironment: 'jsdom',

    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@entities/(.*)$': '<rootDir>/src/entities/$1',
        '^@scenes/(.*)$': '<rootDir>/src/scenes/$1',
        '^@systems/(.*)$': '<rootDir>/src/systems/$1',
        '^@ui/(.*)$': '<rootDir>/src/ui/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^uuid$': require.resolve('uuid')
    }
};
