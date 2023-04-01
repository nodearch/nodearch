import { IComponentOptions } from '@nodearch/core';
import { CommandDecorator } from './enums.js';
import { componentDecorator } from '@nodearch/core/decorators';


export const Command = (options?: IComponentOptions): ClassDecorator => 
  componentDecorator({ id: CommandDecorator.COMMAND, options });