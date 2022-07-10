import { ILoggerHandler } from '../interfaces';
import { LogLevel } from '../enums';
import { IConsoleLoggerOptions, ILogColorMap } from './interfaces';
import { Color } from './enums';


export class ConsoleLogger implements ILoggerHandler {

  private colorMap: ILogColorMap;

  constructor(private options: IConsoleLoggerOptions) {
    this.colorMap = {
      [LogLevel.Error]: Color.fgRed,
      [LogLevel.Warn]: Color.fgYellow,
      [LogLevel.Info]: Color.fgGreen,
      [LogLevel.Debug]: Color.fgBlue
    };
  }

  log(logLevel: LogLevel, timestamp: string, tag: string, args: any[]) {
    const printArgs: any[] = [
        this.bracketWrap(this.colorWrap(timestamp, logLevel)),
        this.bracketWrap(this.colorWrap(tag, logLevel)),
        ...args
      ];

    let str = '';

    for (let i = 0; i < printArgs.length; i++) {

      if (printArgs[i] instanceof Error) {
        str += printArgs[i].stack;
      }
      else if (typeof printArgs[i] === 'object') {
        str += JSON.stringify(printArgs[i], null, 2);
      }
      else {
        str += printArgs[i];
      }

      if (i !== printArgs.length - 1) {
        str += ' ';
      }
      else {
        str += Color.reset;
      }
    }

    console.log(str);
  }

  private colorWrap(text: string, logLevel: LogLevel) {
    if (!this.options.disableColors) {
      return this.colorMap[logLevel] + text + Color.reset;
    }
    else return text;
  }

  private bracketWrap(text: string) {
    return '[' + text + ']';
  }
}