import { ILoggerHandler, ILoggerHandlerOptions } from './interfaces';
import { Color } from './enums';

export class ConsoleLogger implements ILoggerHandler {

  private options?: ILoggerHandlerOptions;
  private timestampFn: () => string;

  constructor(options?: ILoggerHandlerOptions) {
    this.options = options;
    this.timestampFn = this.options?.getTimestamp || this.getTimestamp;
  }

  log(color: Color, tag: string, args: any[]) {
    if (this.options?.disable) return;

    const printArgs: any[] = this.options?.disableColors ?
      [this.timestampFn(), tag, ...args] : [
        this.bracketWrap(this.colorWrap(this.timestampFn(), Color.fgCyan)),
        this.bracketWrap(this.colorWrap(tag, color)),
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

  private colorWrap(text: string, color: Color) {
    return color + text + Color.reset;
  }

  private bracketWrap(text: string) {
    return '[' + text + ']';
  }

  private getTimestamp() {
    return new Date().toDateString();
  }
}