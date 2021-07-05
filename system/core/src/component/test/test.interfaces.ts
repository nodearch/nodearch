import { ClassConstructor } from '../../utils';

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

export interface ITestMockOptions {
// TODO: do we need options for Mock?
}

export interface ITestSuiteOptions {
  title: string;
}

export type ITestComponentMetadata = ITestSuiteComponentMetadata | ITestMockComponentMetadata;

export interface ITestSuiteComponentMetadata {
  type: 'suite';
  title: string;
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
  spy?: IComponentSpy[];
  beforeAll?(): Promise<void>;
  afterAll?(): Promise<void>;
  beforeEach?(): Promise<void>;
  afterEach?(): Promise<void>;
  disableExtensions?: boolean;
}

export interface IMockMetadata {
  mockComponent: ClassConstructor;
}

// export interface ITestBeforeMetadata extends ITestHookMetadata {}