import { MetadataInfo } from './metadata';
import 'reflect-metadata'

describe('components/metadata', () => {
  describe('MetadataInfo.getClassMetadata', () => {
    it('Should Successfully get class metadata', () => {

      class TestClass {}

      Reflect.defineMetadata(MetadataInfo.PREFIX + 'key', {metadata: 'test'}, TestClass);

      const classMetadata = MetadataInfo.getClassMetadata('key', TestClass);

      expect(classMetadata).toEqual({metadata: 'test'});
    });
  });

  describe('MetadataInfo.setClassMetadata', () => {
    it('Should Successfully set class metadata', () => {

      class TestClass {}

      Reflect.defineMetadata(MetadataInfo.PREFIX + 'key', {metadata: 'test'}, TestClass);

      MetadataInfo.setClassMetadata('key', TestClass, {metadata: 'test'});

      expect(Reflect.getMetadata(MetadataInfo.PREFIX + 'key', TestClass)).toEqual({metadata: 'test'});
    });
  });

  describe('MetadataInfo.getMethodMetadata', () => {
    it('Should Successfully get class method metadata', () => {

      class TestClass {}

      Reflect.defineMetadata(MetadataInfo.PREFIX + 'key', {metadata: 'test2'}, TestClass, 'testFunc');

      const classMethodMetadata = MetadataInfo.getMethodMetadata('key', TestClass, 'testFunc');

      expect(classMethodMetadata).toEqual({metadata: 'test2'});
    });
  });

  describe('MetadataInfo.setMethodMetadata', () => {
    it('Should Successfully set class method metadata', () => {

      class TestClass {}

      MetadataInfo.setMethodMetadata('key', TestClass, 'testFunc', {metadata: 'test2'});

      expect(Reflect.getMetadata(MetadataInfo.PREFIX + 'key', TestClass, 'testFunc')).toEqual({metadata: 'test2'});
    });
  });

  describe('MetadataInfo.getClassParams', () => {
    it('Should Successfully get class params', () => {

      class TestClass {}

      const classParams = MetadataInfo.getClassParams(TestClass);

      expect(classParams).toEqual([]);
    });
  });

  describe('MetadataInfo.getMethodParams', () => {
    it('Should Successfully get class method params', () => {

      class TestClass {}

      const methodParams = MetadataInfo.getMethodParams(TestClass, 'testFunc');

      expect(methodParams).toEqual([]);
    });
  });
});