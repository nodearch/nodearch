import { ComponentFactory, IComponentOptions } from '@nodearch/core';
import { CommandAnnotation } from './enums.js';


export const Command = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CommandAnnotation.Command, options });