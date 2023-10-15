import { ICommandOptionsBuilder } from '../decorators/yargs.interfaces.js';


export interface ICommandAppOptions {
  autoStart?: boolean;
  name: string;
  usage: string;
  
  /**
   * Object that gives hints about the options that your command accepts.
   * can also be a function. This function is executed with a yargs instance, 
   * and can be used to provide advanced command specific help.
   */
  options?: ICommandOptionsBuilder;
}