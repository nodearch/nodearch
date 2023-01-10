import { ClassConstructor } from '../../../utils/types.js';
import { TestMode } from './test.enums.js';


// export type TestHook = (hook: () => Promise<void>) => void;
export type TestHookMethod = { (): Promise<void> };
export type TestHook = { title?: string; fn: TestHookMethod };
export type TestCase = { title: string; fn?: TestHookMethod };

export interface ITestRunnerSuite {
  name: string;
  timeout?: number;
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

export interface ITestSuiteOptions {
  mode?: TestMode;
  title?: string;
  timeout?: number; // TODO check we're using timeout and pass more options
}

export interface ITestSuiteMetadata extends Required<ITestSuiteOptions> {}

export interface ITestHookMetadata {
  method: string;
  title?: string;
}

export interface ITestCaseOptions {
  title?: string;
  active?: boolean;
  params?: object;
}

export interface ITestCaseMetadata extends Required<ITestCaseOptions> {
  method: string;
}

export interface IComponentOverride {
  use: any;
  component: ClassConstructor;
}

export interface IComponentSpy {
  component: ClassConstructor;
  method: string;
}

export interface IMockMetadata {
  mockComponent: ClassConstructor;
}

// export interface ITestBeforeMetadata extends ITestHookMetadata {}