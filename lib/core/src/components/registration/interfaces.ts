import { ClassConstructor } from '../../utils';
import { IComponentHandler, IComponentOptions } from '../interfaces';


export interface IComponentRegistration {
  id: string;
  handler?: ClassConstructor<IComponentHandler>; 
  options?: IComponentOptions;
  data?: any;
}