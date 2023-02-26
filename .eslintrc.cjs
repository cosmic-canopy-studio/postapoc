// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  env: {
    browser: true,
    es2021: true,
    jest: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin`
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:regexp/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:jest-formatting/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-redux/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.`
  ],
  overrides: [],
  plugins: [
    '@typescript-eslint',
    'import',
    'regexp',
    'only-warn',
    'jest',
    'jest-formatting',
    'react-redux',
    'react',
    'react-hooks',
    'jsx-a11y'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    project: [
      './tsconfig.json',
      './tsconfig.eslint.json',
      './tsconfig.node.json'
    ],
    tsconfigRootDir: './',
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  root: true,
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'no-restricted-imports': 'off',
    'import/named': 2,
    '@typescript-eslint/no-restricted-imports': [
      'warn',
      {
        name: 'react-redux',
        importNames: ['useSelector', 'useDispatch'],
        message:
          'Use typed hooks `useAppDispatch` and `useAppSelector` instead.'
      }
    ]
  },
  ignorePatterns: ['src/**/*.test.ts']
});
