import { CoreAnnotation } from '../../enums';
import { IComponentOptions } from '../../interfaces';
import { ComponentFactory } from '../../registration';

// TODO: should we move this to backend packages instead?

export const Controller = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Controller, options});