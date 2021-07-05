import { MetadataInfo } from '../../metadata';
import { ITestCaseMetadata, ITestHookMetadata, ITestComponentMetadata, IMockMetadata } from './test.interfaces';

export abstract class TestMetadata {
  static readonly PREFIX = 'core/component/test';
  static readonly TEST = TestMetadata.PREFIX + '-test';
  static readonly BEFORE_ALL = TestMetadata.PREFIX + '-beforeAll';
  static readonly AFTER_ALL = TestMetadata.PREFIX + '-afterAll';
  static readonly BEFORE_EACH = TestMetadata.PREFIX + '-beforeEach';
  static readonly AFTER_EACH = TestMetadata.PREFIX + '-afterEach';
  static readonly CASE = TestMetadata.PREFIX + '-case';
  static readonly MOCK = TestMetadata.PREFIX + '-mock';


  static getTestInfo(classInstance: object): ITestComponentMetadata | undefined {
    return MetadataInfo.getClassMetadata(TestMetadata.TEST, classInstance);
  }

  static setTestInfo(classInstance: object, testInfo: ITestComponentMetadata) {
    MetadataInfo.setClassMetadata(TestMetadata.TEST, classInstance, testInfo);
  }

  static getMocks(classInstance: object): IMockMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.MOCK, classInstance) || [];
  }

  static setMock(classInstance: object, mockInfo: IMockMetadata) {
    const existingMocks = TestMetadata.getMocks(classInstance);
    existingMocks.push(mockInfo);

    MetadataInfo.setClassMetadata(TestMetadata.MOCK, classInstance, existingMocks)
  }

  static getBeforeAll(classInstance: object): ITestHookMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.BEFORE_ALL, classInstance) || [];
  }

  static setBeforeAll(classInstance: object, beforeInfo: ITestHookMetadata) {
    const existingBeforeAll = TestMetadata.getBeforeAll(classInstance);
    existingBeforeAll.push(beforeInfo);
    MetadataInfo.setClassMetadata(TestMetadata.BEFORE_ALL, classInstance, existingBeforeAll);
  }

  static getAfterAll(classInstance: object): ITestHookMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.AFTER_ALL, classInstance) || [];
  }

  static setAfterAll(classInstance: object, afterInfo: ITestHookMetadata) {
    const existingAfterAll = TestMetadata.getAfterAll(classInstance);
    existingAfterAll.push(afterInfo);
    MetadataInfo.setClassMetadata(TestMetadata.AFTER_ALL, classInstance, existingAfterAll);
  }

  static getBeforeEach(classInstance: object): ITestHookMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.BEFORE_EACH, classInstance) || [];
  }

  static setBeforeEach(classInstance: object, beforeEachInfo: ITestHookMetadata) {
    const existingBeforeEach = TestMetadata.getBeforeEach(classInstance);
    existingBeforeEach.push(beforeEachInfo);
    MetadataInfo.setClassMetadata(TestMetadata.BEFORE_EACH, classInstance, existingBeforeEach);
  }

  static getAfterEach(classInstance: object): ITestHookMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.AFTER_EACH, classInstance) || [];
  }

  static setAfterEach(classInstance: object, afterEachInfo: ITestHookMetadata) {
    const existingAfterEach = TestMetadata.getAfterEach(classInstance);
    existingAfterEach.push(afterEachInfo);
    MetadataInfo.setClassMetadata(TestMetadata.AFTER_EACH, classInstance, existingAfterEach);
  }

  static getCases(classInstance: object): ITestCaseMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.CASE, classInstance) || [];
  }

  static setCase(classInstance: object, testCase: ITestCaseMetadata) {
    const existingCases = TestMetadata.getCases(classInstance);
    existingCases.push(testCase);
    MetadataInfo.setClassMetadata(TestMetadata.CASE, classInstance, existingCases);
  }
}
