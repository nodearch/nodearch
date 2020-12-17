import { Color, LogLevel } from './enums';
import { ILoggerHandler } from './interfaces';

export class Logger {
  
  private readonly loggerHandler: ILoggerHandler;
  private logLevel: LogLevel;

  constructor(loggerHandler: ILoggerHandler, logLevel?: LogLevel) {
    this.loggerHandler = loggerHandler;
    this.logLevel = logLevel || LogLevel.Info;
  }

  error(...args: any[]): void {
    if (this.logLevel >= LogLevel.Error) {
      this.loggerHandler.log(Color.fgRed, 'ERROR', args);
    }
  }

  warn(...args: any[]): void {
    if (this.logLevel >= LogLevel.Warn) {
      this.loggerHandler.log(Color.fgYellow, 'WARN', args);
    }
  }

  info(...args: any[]): void {
    if (this.logLevel >= LogLevel.Info) {
      this.loggerHandler.log(Color.fgGreen, 'INFO', args);
    }
  }

  debug(...args: any[]): void {
    if (this.logLevel >= LogLevel.Debug) {
      this.loggerHandler.log(Color.fgBlue, 'DEBUG', args);
    }
  }

  setLogLevel(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }
}
