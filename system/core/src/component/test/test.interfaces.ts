// export type TestHook = (hook: () => Promise<void>) => void;
export type TestHook = () => Promise<void>;

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