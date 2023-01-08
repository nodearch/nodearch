import { ConsoleLogger } from './console/console-logger.js';
import { LogLevel } from './enums.js';
import { ILoggerHandler, ILogOptions } from './interfaces.js';


export class Logger {
  
  private readonly loggerHandler: ILoggerHandler;
  private logLevel: LogLevel;
  private getTimestamp: () => string;
  private isDisabled: boolean;

  constructor(loggingOptions?: ILogOptions) {
    this.loggerHandler = loggingOptions?.logger ? new loggingOptions.logger : new ConsoleLogger({ disableColors: false });
    this.logLevel = loggingOptions?.logLevel || LogLevel.Info;
    this.getTimestamp = loggingOptions?.getTimestamp || this.defaultGetTimestamp;
    this.isDisabled = loggingOptions?.disable === undefined ? false : loggingOptions?.disable;
  }

  error(...args: any[]): void {
    this.writeLogs(LogLevel.Error, 'ERROR', args);
  }

  warn(...args: any[]): void {
    this.writeLogs(LogLevel.Warn, 'WARN', args);
  }

  info(...args: any[]): void {
    this.writeLogs(LogLevel.Info, 'INFO', args);
  }

  debug(...args: any[]): void {
    this.writeLogs(LogLevel.Debug, 'DEBUG', args);
  }

  setLogLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  private defaultGetTimestamp() {
    return new Date().toDateString();
  }

  private writeLogs(logLevel: LogLevel, tag: string, args: any[]) {
    if (!this.isDisabled && this.logLevel >= logLevel) {
      this.loggerHandler.log(logLevel, this.getTimestamp(), tag, args);
    }
  }
}
