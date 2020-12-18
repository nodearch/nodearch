import { MetadataInfo } from '../metadata';

export abstract class ComponentMetadata {
  static readonly PREFIX = 'core/component';
  static readonly COMPONENT_INFO = ComponentMetadata.PREFIX + '-info';

  static getInfo<T>(classDef: any): T | undefined {
    return MetadataInfo.getClassMetadata(ComponentMetadata.COMPONENT_INFO, classDef);
  }

  static setInfo<T>(classDef: any, componentInfo: T) {
    MetadataInfo.setClassMetadata(ComponentMetadata.COMPONENT_INFO, classDef, componentInfo);
  }
}
