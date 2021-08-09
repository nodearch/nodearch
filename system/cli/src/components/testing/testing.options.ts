import { CLIBuilder } from '@nodearch/core';

export const options: CLIBuilder = {
  runner: {
    alias: ['r'],
    describe: 'test runner to use',
    default: 'mocha'
  },
  coverage: {
    alias: ['c'],
    describe: 'test coverage',
    boolean: true,
    default: false
  },

  // Mocha options
  'allow-uncaught': {
    describe: 'Allow uncaught errors to propagate',
    boolean: true,
    default: false
  },
  bail: {
    describe: 'Bail on the first test failure',
    boolean: true,
    default: false,
    alias: ['b']
  },
  'check-leaks': {
    describe: 'Check for global variable leaks',
    boolean: true,
    default: false
  },
  color: {
    describe: 'Force-enable color output',
    boolean: true,
    default: true
  },
  delay: {
    describe: 'Delay initial execution of root suite',
    boolean: true,
    default: false
  },
  diff: {
    describe: 'Show diff on failure',
    boolean: true,
    default: true
  },
  fgrep: {
    describe: 'Only run tests containing this string',
    alias: ['f'],
    optional: true,
    
  }
};