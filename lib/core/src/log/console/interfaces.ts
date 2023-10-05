import { LogLevel } from '../enums.js';
import { Color } from './enums.js';


export interface IConsoleLoggerOptions {
  disableColors?: boolean;
}

export type ILogColorMap = {
  [key in LogLevel]: Color;
};
