import { ConsoleLogger } from './console/console-logger.js';
import { LogLevel } from './enums.js';
import { ILoggerHandler, ILogOptions } from './interfaces.js';


export class Logger {
  
  private readonly loggerHandler: ILoggerHandler;
  private logLevel: LogLevel;
  private getTimestamp: () => string;
  private isDisabled: boolean;
  private prefix?: string;
  private logLevelPriority: LogLevel[] = [
    LogLevel.Error,
    LogLevel.Warn,
    LogLevel.Info,
    LogLevel.Debug
  ];

  constructor(loggingOptions?: ILogOptions) {
    this.loggerHandler = loggingOptions?.logger ? new loggingOptions.logger : new ConsoleLogger({ disableColors: loggingOptions?.disableColors });
    this.logLevel = loggingOptions?.logLevel || LogLevel.Info;
    this.getTimestamp = loggingOptions?.getTimestamp || this.defaultGetTimestamp;
    this.isDisabled = loggingOptions?.disable === undefined ? false : loggingOptions?.disable;
    this.prefix = loggingOptions?.prefix;
  }

  error(...args: any[]): void {
    this.writeLogs(LogLevel.Error, args);
  }

  warn(...args: any[]): void {
    this.writeLogs(LogLevel.Warn, args);
  }

  info(...args: any[]): void {
    this.writeLogs(LogLevel.Info, args);
  }

  debug(...args: any[]): void {
    this.writeLogs(LogLevel.Debug, args);
  }

  setLogLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  getLogLevel() {
    return this.logLevel;
  }

  private defaultGetTimestamp() {
    return new Date().toISOString();
  }

  private writeLogs(logLevel: LogLevel, args: any[]) {
    if (this.logEnabled(logLevel)) {
      this.loggerHandler.log({
        logLevel,
        args,
        timestamp: this.getTimestamp(),
        prefix: this.prefix
      });
    }
  }

  private logEnabled(logLevel: LogLevel) {
    return !this.isDisabled && this.getPriority(this.logLevel) >= this.getPriority(logLevel);
  }

  private getPriority(logLevel: LogLevel) {
    return this.logLevelPriority.indexOf(logLevel);
  }
}
