import { ClassConstructor } from '../../utils';
import { ComponentHandler } from '../handler';
import { IComponentOptions } from '../interfaces';


export interface IComponentRegistration {
  id: string;
  handler?: ClassConstructor<ComponentHandler>; 
  options?: IComponentOptions;
  data?: any;
}