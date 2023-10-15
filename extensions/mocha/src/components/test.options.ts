import { ICommandBuilder } from '@nodearch/command';


const list = (str: any) =>
  Array.isArray(str) ? exports.list(str.join(',')) : str.split(/ *, */);

const GROUPS = {
  GENERAL: 'General Options',
  MOCHA: 'Test Runner Options [Mocha]'
};

export const testOptions: ICommandBuilder<any> = {
  // General Options
  mode: {
    alias: ['m'],
    describe: 'The mode in which to start the testing app',
    type: 'array',
    default: 'unit',
    choices: ['unit', 'integration', 'e2e'],
    group: GROUPS.GENERAL
  },

  // Test Runner Options [Mocha]
  // common\temp\node_modules\.pnpm\mocha@10.1.0\node_modules\mocha\lib\cli\run.js
  'allow-uncaught': {
    describe: 'Allow uncaught errors to propagate',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'bail': {
    describe: 'Bail on the first test failure',
    type: 'boolean',
    default: false,
    alias: ['b'],
    group: GROUPS.MOCHA
  },
  'check-leaks': {
    describe: 'Check for global variable leaks',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'color': {
    describe: 'Force-enable color output',
    type: 'boolean',
    default: true,
    group: GROUPS.MOCHA
  },
  'delay': {
    describe: 'Delay initial execution of root suite',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'diff': {
    describe: 'Show diff on failure',
    type: 'boolean',
    default: true,
    group: GROUPS.MOCHA
  },
  'dry-run': {
    describe: 'Report tests without running them?',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'fail-zero': {
    description: 'Fail test run if no test(s) encountered',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'full-trace': {
    describe: 'Full stacktrace upon failure?',
    type: 'boolean',
    requiresArg: false,
    group: GROUPS.MOCHA
  },
  'globals': {
    coerce: list,
    describe: 'Variables expected in global scope.',
    type: 'array',
    requiresArg: true,
    group: GROUPS.MOCHA
  },
  'forbid-only': {
    description: 'Fail if exclusive test(s) encountered',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'forbid-pending': {
    description: 'Fail if pending test(s) encountered',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'inline-diffs': {
    describe: 'Display inline diffs?',
    type: 'boolean',
    requiresArg: false,
    group: GROUPS.MOCHA
  },
  'invert': {
    describe: 'Invert test filter matches?',
    type: 'boolean',
    default: false,
    group: GROUPS.MOCHA
  },
  'reporter': {
    describe: 'Reporter name or constructor.',
    type: 'string',
    default: 'spec',
    group: GROUPS.MOCHA
  },
  'fgrep': {
    describe: 'Only run tests containing this string',
    alias: ['f'],
    type: 'string',
    requiresArg: true,
    conflicts: 'grep',
    group: GROUPS.MOCHA
  },
  'grep': {
    coerce: (value: any) => (!value ? null : value),
    describe: 'Only run tests matching this string or regexp',
    alias: ['g'],
    type: 'string',
    requiresArg: true,
    conflicts: 'fgrep',
    group: GROUPS.MOCHA
  },
  'retries': {
    describe: 'Number of times to retry failed tests.',
    type: 'number',
    requiresArg: false,
    group: GROUPS.MOCHA
  },
  'slow': {
    describe: 'Slow threshold value.',
    type: 'number',
    default: 75,
    group: GROUPS.MOCHA
  },
  'timeout': {
    describe: 'Timeout threshold value.',
    type: 'number',
    default: 2000,
    group: GROUPS.MOCHA
  },
  'ui': {
    describe: 'Interface name.',
    type: 'string',
    default: 'bdd',
    group: GROUPS.MOCHA
  }
};