// export type TestHook = (hook: () => Promise<void>) => void;
export type TestHook = { title?: string; fn: () => Promise<void> };
export type TestCase = { title: string; fn?: () => Promise<void> };

export interface ITestRunnerSuite {
  name: string;
  beforeAll: TestHook[];
  afterAll: TestHook[];
  beforeEach: TestHook[];
  afterEach: TestHook[];
  testCases: TestCase[];
}

export interface ITestRunner {
  addSuite(suite: ITestRunnerSuite): void;
  run(): Promise<void>;
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

export interface ITestCaseMetadata {
  method: string;
  title: string;
  active: boolean;
}

// export interface ITestBeforeMetadata extends ITestHookMetadata {}