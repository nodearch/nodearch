import { CommandBuilder } from '@nodearch/command';


const list = (str: any) =>
  Array.isArray(str) ? exports.list(str.join(',')) : str.split(/ *, */);

const GROUPS = {
  GENERAL: 'General Options',
  MOCHA: 'Test Runner Options [Mocha]',
  NYC: 'Code Coverage Options [Nyc]'
};

export const testOptions: CommandBuilder<any> = {
  // General Options
  mode: {
    alias: ['m'],
    describe: 'The mode in which to start the testing app',
    type: 'array',
    default: 'unit',
    choices: ['unit', 'integration', 'e2e'],
    group: GROUPS.GENERAL
  },
  coverage: {
    alias: ['c'],
    describe: 'enable test coverage',
    type: 'boolean',
    default: false,
    group: GROUPS.GENERAL
  },
  'open-coverage': {
    describe: 'open coverage report in the default browser after tests complete',
    type: 'boolean',
    default: false,
    group: GROUPS.GENERAL
  },

  // Test Runner Options [Mocha]
  // common\temp\node_modules\.pnpm\mocha@10.1.0\node_modules\mocha\lib\cli\run.js
  'mocha-allow-uncaught': {
    describe: 'Allow uncaught errors to propagate',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'mocha-bail': {
    describe: 'Bail on the first test failure',
    type: 'boolean',
    default: false,
    alias: ['b'],
    group: GROUPS.MOCHA
  },
  'mocha-check-leaks': {
    describe: 'Check for global variable leaks',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'mocha-color': {
    describe: 'Force-enable color output',
    type: 'boolean',
    default: true,
    group: GROUPS.MOCHA
  },
  'mocha-delay': {
    describe: 'Delay initial execution of root suite',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'mocha-diff': {
    describe: 'Show diff on failure',
    type: 'boolean',
    default: true,
    group: GROUPS.MOCHA
  },
  'mocha-dry-run': {
    describe: 'Report tests without running them?',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'mocha-fail-zero': {
    description: 'Fail test run if no test(s) encountered',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'mocha-full-trace': {
    describe: 'Full stacktrace upon failure?',
    type: 'boolean',
    requiresArg: false,
    group: GROUPS.MOCHA
  },
  'mocha-globals': {
    coerce: list,
    describe: 'Variables expected in global scope.',
    type: 'array',
    requiresArg: true,
    group: GROUPS.MOCHA
  },
  'mocha-forbid-only': {
    description: 'Fail if exclusive test(s) encountered',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'mocha-forbid-pending': {
    description: 'Fail if pending test(s) encountered',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'mocha-inline-diffs': {
    describe: 'Display inline diffs?',
    type: 'boolean',
    requiresArg: false,
    group: GROUPS.MOCHA
  },
  'mocha-invert': {
    describe: 'Invert test filter matches?',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'mocha-reporter': {
    describe: 'Reporter name or constructor.',
    type: 'string',
    default: 'spec',
    group: GROUPS.MOCHA
  },
  'mocha-fgrep': {
    describe: 'Only run tests containing this string',
    alias: ['f'],
    type: 'string',
    requiresArg: true,
    conflicts: 'mocha-grep',
    group: GROUPS.MOCHA
  },
  'mocha-grep': {
    coerce: (value: any) => (!value ? null : value),
    describe: 'Only run tests matching this string or regexp',
    alias: ['g'],
    type: 'string',
    requiresArg: true,
    conflicts: 'mocha-fgrep',
    group: GROUPS.MOCHA
  },
  'mocha-retries': {
    describe: 'Number of times to retry failed tests.',
    type: 'number',
    requiresArg: false,
    group: GROUPS.MOCHA
  },
  'mocha-slow': {
    describe: 'Slow threshold value.',
    type: 'number',
    default: 75,
    group: GROUPS.MOCHA
  },
  'mocha-timeout': {
    describe: 'Timeout threshold value.',
    type: 'number',
    default: 2000,
    group: GROUPS.MOCHA
  },
  'mocha-ui': {
    describe: 'Interface name.',
    type: 'string',
    default: 'bdd',
    group: GROUPS.MOCHA
  },

  // Coverage Options [Nyc]
  'nyc-all': {
    describe: 'Whether or not to instrument all files (not just the ones touched by your test suite)',
    type: 'boolean',
    default: false,
    group: GROUPS.NYC
  },
  'nyc-check-coverage': {
    describe: 'Check whether coverage is within thresholds, fail if not',
    type: 'boolean',
    default: false,
    group: GROUPS.NYC
  },
  'nyc-reporter': {
    describe: 'May be set to a built-in coverage reporter or an npm package (dev)dependency',
    type: 'array',
    default: ['text', 'html'],
    group: GROUPS.NYC
  },
  'nyc-reporter-dir': {
    describe: 'Where to put the coverage report files',
    type: 'string',
    default: './coverage',
    group: GROUPS.NYC
  },
  'nyc-skip-full': {
    describe: 'Don\'t show files with 100% statement, branch, and function coverage',
    type: 'boolean',
    default: false,
    group: GROUPS.NYC
  },
  'nyc-temp-dir': {
    describe: 'Directory to output raw coverage information to',
    type: 'string',
    default: './.nyc_output',
    group: GROUPS.NYC
  }
};