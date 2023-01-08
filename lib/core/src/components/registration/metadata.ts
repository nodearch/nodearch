import { MetadataInfo } from '../../metadata/metadata.js';
import { ClassConstructor } from '../../utils/types.js';
import { IComponentDecorator } from '../interfaces.js';
import { IComponentRegistration } from './interfaces.js';


export abstract class ComponentMetadata {
  static readonly PREFIX = 'component/';
  static readonly COMPONENT_REGISTRATION = ComponentMetadata.PREFIX + 'registration';
  static readonly COMPONENT_DECORATORS = ComponentMetadata.PREFIX + 'decorators';

  static getComponentRegistration(classConstructor: ClassConstructor): IComponentRegistration | undefined {
    return MetadataInfo.getClassMetadata(ComponentMetadata.COMPONENT_REGISTRATION, classConstructor);
  }

  static setComponentRegistration(classConstructor: ClassConstructor, registration: IComponentRegistration) {
    MetadataInfo.setClassMetadata(ComponentMetadata.COMPONENT_REGISTRATION, classConstructor, registration);
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
