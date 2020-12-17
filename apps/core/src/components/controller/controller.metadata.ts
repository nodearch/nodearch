import { MetadataInfo } from '../../metadata';

export abstract class ControllerMetadata {

  static readonly PREFIX = 'core/controller';
  static readonly INTERCEPTOR_PREFIX = ControllerMetadata.PREFIX + '-interceptors';

  static getInterceptors<T>(classDef: any): T[] {
    return MetadataInfo.getClassMetadata(ControllerMetadata.INTERCEPTOR_PREFIX, classDef) || [];
  }

  static setInterceptor<T>(classDef: any, guardInfo: T) {
    const existingInterceptors = ControllerMetadata.getInterceptors(classDef);
    existingInterceptors.push(guardInfo);
    MetadataInfo.setClassMetadata(ControllerMetadata.INTERCEPTOR_PREFIX, classDef, existingInterceptors);
  }
}