// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin`
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.`
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:regexp/recommended'
  ],
  overrides: [],
  plugins: ['@typescript-eslint', 'import', 'regexp', 'only-warn'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    project: 'tsconfig.json',
    tsconfigRootDir: './'
  },
  root: true,
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    eqeqeq: ['warn', 'always', { null: 'never' }]
    // '@typescript-eslint/explicit-function-return-type': 0,
    // '@typescript-eslint/ban-ts-ignore': 0,
    // '@typescript-eslint/member-delimiter-style': 0,
    // '@typescript-eslint/no-explicit-any': 0,
  }
});
