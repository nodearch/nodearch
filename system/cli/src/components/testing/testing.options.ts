import { CLIBuilder } from '@nodearch/core';



export const testOptions: CLIBuilder = {
  // Test Runner Options
  runner: {
    alias: ['r'],
    describe: 'test runner to use',
    type: 'string',
    default: 'mocha',
    group: 'Test Runner'
  },

  'allow-uncaught': {
    describe: 'Allow uncaught errors to propagate',
    type: 'boolean',
    default: false,
    group: 'Test Runner'
  },
  bail: {
    describe: 'Bail on the first test failure',
    type: 'boolean',
    default: false,
    alias: ['b'],
    group: 'Test Runner'
  },
  'check-leaks': {
    describe: 'Check for global variable leaks',
    type: 'boolean',
    default: false,
    group: 'Test Runner'
  },
  color: {
    describe: 'Force-enable color output',
    type: 'boolean',
    default: true,
    group: 'Test Runner'
  },
  delay: {
    describe: 'Delay initial execution of root suite',
    type: 'boolean',
    default: false,
    group: 'Test Runner'
  },
  diff: {
    describe: 'Show diff on failure',
    type: 'boolean',
    default: true,
    group: 'Test Runner'
  },
  'dry-run': {
    describe: 'Report tests without running them?',
    type: 'boolean',
    default: false,
    group: 'Test Runner'
  },
  'full-trace': {
    describe: 'Full stacktrace upon failure?',
    type: 'boolean',
    requiresArg: false,
    group: 'Test Runner'
  },
  globals: {
    describe: 'Variables expected in global scope.',
    type: 'array',
    requiresArg: false,
    group: 'Test Runner'
  },
  'inline-diffs': {
    describe: 'Display inline diffs?',
    type: 'boolean',
    requiresArg: false,
    group: 'Test Runner'
  },
  invert: {
    describe: 'Invert test filter matches?',
    type: 'boolean',
    default: false,
    group: 'Test Runner'
  },
  'no-highlighting': {
    describe: 'Disable syntax highlighting?',
    type: 'boolean',
    default: false,
    group: 'Test Runner'
  },
  reporter: {
    describe: 'Reporter name or constructor.',
    type: 'string',
    default: 'spec',
    group: 'Test Runner'
  },
  fgrep: {
    describe: 'Only run tests containing this string',
    alias: ['f'],
    type: 'boolean',
    requiresArg: false,
    conflicts: 'grep',
    group: 'Test Runner'
  },
  grep: {
    describe: 'Only run tests matching this string or regexp',
    alias: ['g'],
    type: 'boolean',
    requiresArg: false,
    conflicts: 'fgrep',
    group: 'Test Runner'
  },
  retries: {
    describe: 'Number of times to retry failed tests.',
    type: 'number',
    requiresArg: false,
    group: 'Test Runner'
  },
  slow: {
    describe: 'Slow threshold value.',
    type: 'number',
    default: 75,
    group: 'Test Runner'
  },
  timeout: {
    describe: 'Timeout threshold value.',
    type: 'number',
    default: 2000,
    group: 'Test Runner'
  },
  ui: {
    describe: 'Interface name.',
    type: 'string',
    default: 'bdd',
    group: 'Test Runner'
  },

  // Coverage Options
  coverage: {
    alias: ['c'],
    describe: 'enable test coverage',
    type: 'boolean',
    default: false,
    group: 'Coverage'
  },
  'open-coverage': {
    describe: 'open coverage report in the default browser after tests complete',
    type: 'boolean',
    default: false,
    group: 'Coverage'
  },
};