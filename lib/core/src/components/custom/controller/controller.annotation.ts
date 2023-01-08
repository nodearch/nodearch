
// TODO: should we move this to backend packages instead?

import { CoreAnnotation } from '../../enums.js';
import { IComponentOptions } from '../../interfaces.js';
import { ComponentFactory } from '../../registration/factory.js';

export const Controller = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CoreAnnotation.Controller, options});