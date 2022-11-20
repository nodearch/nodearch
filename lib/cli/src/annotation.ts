import { ComponentFactory, IComponentOptions } from '@nodearch/core';
import { CliAnnotation } from './enums';


export const Command = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CliAnnotation.Command, options });