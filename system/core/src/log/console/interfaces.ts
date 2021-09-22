import { LogLevel } from '../enums';
import { Color } from './enums';

export interface IConsoleLoggerOptions {
  disableColors: boolean;
}

export type ILogColorMap = {
  [key in LogLevel]: Color;
};
