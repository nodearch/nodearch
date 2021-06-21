// export type TestHook = (hook: () => Promise<void>) => void;
export type TestHook = { title: string; fn: () => Promise<void> };

export interface ITestRunnerSuite {
  name: string;
  before: TestHook[];
  after: TestHook[];
  beforeEach: TestHook[];
  afterEach: TestHook[];
  testCases: TestHook[];
}

export interface ITestRunner {
  addSuite(suite: ITestRunnerSuite): void;
  run(): Promise<number>;
}

export interface ITestComponentOptions {
  title: string;
}

export interface ITestMetadata {
  title: string;
}

export interface ITestHookMetadata {
  method: string;
  title: string;
}

// export interface ITestBeforeMetadata extends ITestHookMetadata {}