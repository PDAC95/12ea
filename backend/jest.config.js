/**
 * Jest Configuration - Entre Amigas Backend
 * Configuración para tests unitarios con ES Modules
 */

export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/scripts/**',
    '!src/config/**',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  verbose: true,
  testTimeout: 10000,
};
