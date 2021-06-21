import { MetadataInfo } from '../../metadata';
import { ITestHookMetadata, ITestMetadata } from './test.interfaces';

export abstract class TestMetadata {
  static readonly PREFIX = 'core/component/test';
  static readonly TEST = TestMetadata.PREFIX + '-test';
  static readonly BEFORE = TestMetadata.PREFIX + '-before';
  static readonly AFTER = TestMetadata.PREFIX + '-after';
  static readonly BEFORE_EACH = TestMetadata.PREFIX + '-beforeEach';
  static readonly AFTER_EACH = TestMetadata.PREFIX + '-afterEach';
  static readonly TEST_CASE = TestMetadata.PREFIX + '-testCase';


  static getTestInfo(classInstance: object): ITestMetadata | undefined {
    return MetadataInfo.getClassMetadata(TestMetadata.TEST, classInstance);
  }

  static setTestInfo(classInstance: object, testInfo: ITestMetadata) {
    MetadataInfo.setClassMetadata(TestMetadata.TEST, classInstance, testInfo);
  }  

  static getBefore(classInstance: object): ITestHookMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.BEFORE, classInstance) || [];
  }

  static setBefore(classInstance: object, beforeInfo: ITestHookMetadata) {
    const existingBefore = TestMetadata.getBefore(classInstance);
    existingBefore.push(beforeInfo);
    MetadataInfo.setClassMetadata(TestMetadata.BEFORE, classInstance, existingBefore);
  }

  static getAfter(classInstance: object): ITestHookMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.AFTER, classInstance) || [];
  }

  static setAfter(classInstance: object, afterInfo: ITestHookMetadata) {
    const existingAfter = TestMetadata.getAfter(classInstance);
    existingAfter.push(afterInfo);
    MetadataInfo.setClassMetadata(TestMetadata.AFTER, classInstance, existingAfter);
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

  static getTestCases(classInstance: object): ITestHookMetadata[] {
    return MetadataInfo.getClassMetadata(TestMetadata.TEST_CASE, classInstance) || [];
  }

  static setTestCase(classInstance: object, testCase: ITestHookMetadata) {
    const existingTestCases = TestMetadata.getTestCases(classInstance);
    existingTestCases.push(testCase);
    MetadataInfo.setClassMetadata(TestMetadata.TEST_CASE, classInstance, existingTestCases);
  }
}
