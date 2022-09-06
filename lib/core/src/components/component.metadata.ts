import { MetadataInfo } from '../metadata';
import { ClassConstructor } from '../utils';
import { IComponentDecorator, IComponentInfo } from './interfaces';



export abstract class ComponentMetadata {
  static readonly PREFIX = 'component/';
  static readonly COMPONENT_INFO = ComponentMetadata.PREFIX + 'info';
  static readonly COMPONENT_DECORATORS = ComponentMetadata.PREFIX + 'decorators';

  // Component Info
  static getComponentInfo(classConstructor: ClassConstructor): IComponentInfo | undefined {
    return MetadataInfo.getClassMetadata(ComponentMetadata.COMPONENT_INFO, classConstructor);
  }

  static setComponentInfo(classConstructor: ClassConstructor, componentInfo: IComponentInfo) {
    MetadataInfo.setClassMetadata(ComponentMetadata.COMPONENT_INFO, classConstructor, componentInfo);
  }

  // Decorators Info
  static getComponentDecorators(classConstructor: ClassConstructor): IComponentDecorator[] {
    return MetadataInfo.getClassMetadata(ComponentMetadata.COMPONENT_DECORATORS, classConstructor) || [];
  }

  static setComponentDecorator(classConstructor: ClassConstructor, componentDecorator: IComponentDecorator) {
    const decorators = ComponentMetadata.getComponentDecorators(classConstructor);
    
    decorators.push(componentDecorator);

    MetadataInfo.setClassMetadata(ComponentMetadata.COMPONENT_DECORATORS, classConstructor, decorators);
  }
}
