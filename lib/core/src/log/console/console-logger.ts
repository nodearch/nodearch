import { LogLevel } from '../enums.js';
import { ILoggerHandler } from '../interfaces.js';
import { Color } from './enums.js';
import { IConsoleLoggerOptions, ILogColorMap } from './interfaces.js';



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

        str += printArgs[i].message + '\n';

        str += `${Color.fgRed}Stack:${Color.reset}\n\t` + printArgs[i].stack
          .split('\n')
          .slice(1)
          .map((x: string) => x.trim())
          .join('\n\t');

        const detailsList = printArgs[i].details;

        if (detailsList && detailsList.length) {
          str += `\n${Color.fgRed}Details:${Color.reset}\n\t` + detailsList.join('\n\t');
        }
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