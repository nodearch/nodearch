import { ComponentFactory, IComponentOptions } from '@nodearch/core';
import { CommandAnnotation } from './enums';


export const Command = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CommandAnnotation.Command, options });