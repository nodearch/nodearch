module.exports = {
  clearMocks: true,
  roots: ['<rootDir>/src'],
  testMatch: [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec).[jt]s?(x)" ],
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'lcov', 'text'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};