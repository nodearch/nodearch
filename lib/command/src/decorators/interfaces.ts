import { QuestionType } from './enums.js';
import { ICommandModule } from './yargs.interfaces.js';



export type CommandAnswers = Record<string, any>;
export type CommandQuestionsDefault = string | number | boolean | Array<any> | 
  {(answers: CommandAnswers): string | number | boolean | Array<any>};
export type CommandQuestionsChoices = string | number | { name?: string, value?: any, short?: string; extra?: any; };


export interface CommandQuestion<T = any> extends Record<string, any> {
  /**
   * (String) Type of the prompt.
   */
  type: QuestionType;

  /** 
   * (String) The name to use when storing the answer in the answers hash. 
   * If the name contains periods, it will define a path in the answers hash.
   */
  name: string;
  
  /**
   * (String|Function) The question to print. 
   * If defined as a function, 
   * the first parameter will be the current inquirer session answers. 
   * Defaults to the value of name (followed by a colon).
   */
  message?: string | {(answers: CommandAnswers): string};

  /**
   * (String|Number|Boolean|Array|Function) 
   * Default value(s) to use if nothing is entered, 
   * or a function that returns the default value(s). 
   * If defined as a function, 
   * the first parameter will be the current inquirer session answers.
   */
  default?: CommandQuestionsDefault;

  /**
   * (Array|Function) Choices array or a function 
   * returning a choices array. 
   * If defined as a function, 
   * the first parameter will be the current inquirer session answers. 
   * Array values can be simple numbers, strings, 
   * or objects containing a name (to display in list), 
   * a value (to save in the answers hash), 
   * and a short (to display after selection) properties. 
   * The choices array can also contain a Separator.
   */
  choices?: CommandQuestionsChoices[] | {(answers?: CommandAnswers): Promise<CommandQuestionsChoices[]>};

  /**
   * (Function) Receive the user input and answers hash. 
   * Should return true if the value is valid, 
   * and an error message (String) otherwise. 
   * If false is returned, a default error message is provided. 
   */
  validate?(input: any, answers?: CommandAnswers): boolean | string | Promise<boolean | string>;

  /**
   * (Function) Receive the user input and answers hash. 
   * Returns the filtered value to be used inside the program. 
   * The value returned will be added to the Answers hash.
   */
  filter?(input: any, answers?: CommandAnswers): any;

  /**
   * (Function) Receive the user input, answers hash and option flags, 
   * and return a transformed value to display to the user. 
   * The transformation only impacts what is shown while editing. 
   * It does not modify the answers hash.
   */
  transformer?(input: any, answers: CommandAnswers, flags: { isFinal?: boolean }): string | Promise<string>;

  /**
   * (Function, Boolean) Receive the current user answers hash 
   * and should return true or false depending 
   * on whether or not this question should be asked. 
   * The value can also be a simple boolean.
   */
  when?: boolean | {(answers: CommandAnswers): boolean};

  /**
   * (Number) Change the number of lines 
   * that will be rendered when using list, 
   * rawList, expand or checkbox.
   */
  pageSize?: number;

  /**
   * (String) Change the default prefix message.
   */
  prefix?: string; 
  
  /**
   * (String) Change the default suffix message.
   */
  suffix?: string;
  
  /**
   * (Boolean) Force to prompt the question if the answer already exists.
   */
  askAnswered?: boolean; 
  
  /**
   * (Boolean) Enable list looping. Defaults: true
   */
  loop?: boolean;
};

export interface INotificationService {
  notify(message: string): void;
}

export interface ICommand<T = any> extends ICommandModule<T> {
  /**
   * Inquirer questions
   */
  questions?: CommandQuestion[];
}

export enum NpmDependencyType {
  Dependency = 'dep',
  DevDependency = 'dev'
}

export interface INpmDependency {
  name: string;
  version?: string;
  type?: NpmDependencyType,
  when?: (data: any) => boolean;
}