import { ClassConstructor } from '../../utils';

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

export interface ITestMockOptions {
// TODO: do we need options for Mock?
}

export type ITestSuiteOptions = string | {
  name: string;
  timeout?: number;
}

export type ITestComponentMetadata = ITestSuiteComponentMetadata | ITestMockComponentMetadata;

export interface ITestSuiteComponentMetadata {
  type: 'suite';
  name: string;
}

export interface ITestMockComponentMetadata {
  type: 'mock';
}

export interface ITestHookMetadata {
  method: string;
  title?: string;
}

export interface ITestCaseMetadata {
  method: string;
  title: string;
  active: boolean;
}

export interface IComponentOverride {
  use: any;
  component: ClassConstructor;
}

export interface IComponentSpy {
  component: ClassConstructor;
  method: string;
}

export interface IMock {
  override?: IComponentOverride[];
  beforeAll?(): Promise<void>;
  afterAll?(): Promise<void>;
  beforeEach?(): Promise<void>;
  afterEach?(): Promise<void>;
}

export interface IMockMetadata {
  mockComponent: ClassConstructor;
}

// export interface ITestBeforeMetadata extends ITestHookMetadata {}