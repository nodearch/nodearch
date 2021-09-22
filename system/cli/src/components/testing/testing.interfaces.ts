export interface ITestOptions {
  // enable test coverage
  coverage?: boolean;

  // open coverage report in the browser
  openCoverage?: boolean;

  // test runner to use
  runner?: 'mocha';

  // Watch files for changes
  watch?: boolean;

  // Propagate uncaught errors?
  allowUncaught?: boolean;

  // bail on the first test failure.
  bail?: boolean;

  // Check for global variable leaks?
  checkLeaks?: boolean;

  // Color TTY output from reporter
  color?: boolean;

  // Delay root suite execution?
  delay?: boolean;

  // Show diff on failure?
  diff?: boolean;

  // Report tests without running them?
  dryRun?: boolean;

  // Test filter given string.
  fgrep?: string;

  // TODO we need to implement those attributes
  // Tests marked `only` fail the suite?
  // forbidOnly?: boolean;
  // Pending tests fail the suite?
  // forbidPending?: boolean;

  // Full stacktrace upon failure?
  fullTrace?: boolean;

  // Variables expected in global scope.
  globals?: string[];

  // Test filter given regular expression.
  grep?: string | RegExp;

  // TODO check this with the currently implemented notifications 
  // Enable desktop notifications?
  // growl?: boolean;

  // Display inline diffs?
  inlineDiffs?: boolean;

  // Invert test filter matches?
  invert?: boolean;

  // Disable syntax highlighting?
  noHighlighting?: boolean;

  // Reporter name or constructor.
  reporter?: string;

  // TODO investigate this option
  // Reporter settings object.
  // reporterOptions?: any;

  // Number of times to retry failed tests.
  retries?: number;

  // Slow threshold value.
  slow?: number;

  // Timeout threshold value.
  timeout?: number | string;

  // TODO add enum for all available ui interfaces

  // Interface name.
  ui?: string;

  // TODO check if we need to add a root suite first
  // Hooks to bootstrap the root suite with.
  // rootHooks?: RootHookObject;

  // Pathname of `rootHooks` plugin for parallel runs.
  // require?: string[];
}