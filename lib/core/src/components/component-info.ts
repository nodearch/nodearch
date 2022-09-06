import { ClassConstructor, ClassInfo } from '../utils';
import { IComponentDecorator, IComponentHandler, IComponentOptions } from './interfaces';


// TODO: choose another name? Or change IComponentInfo to IComponentMetadata/IComponentOptions
export class ComponentInfo {
  id: string;
  componentClass: ClassConstructor;
  options?: IComponentOptions;
  data?: any;
  methods: string[];
  decorators: IComponentDecorator[];

  constructor(id: string, componentClass: ClassConstructor) {
    this.id = id;
    this.componentClass = componentClass;
    this.decorators = [];
    this.methods = ClassInfo.getMethods(componentClass);
  }

  getInstance() {}

  getMethodDecorators() {}
}