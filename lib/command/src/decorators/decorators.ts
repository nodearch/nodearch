import { IComponentOptions } from '@nodearch/core';
import { CommandDecorator } from './enums.js';
import { ComponentFactory } from '@nodearch/core/decorators';


export const Command = (options?: IComponentOptions): ClassDecorator => 
  ComponentFactory.componentDecorator({ id: CommandDecorator.COMMAND, options });