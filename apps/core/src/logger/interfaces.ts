import { Color, LogLevel } from './enums';

export interface ILogger {
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
  setLogLevel(logLevel: LogLevel): void;
}

export interface ILoggerHandlerOptions {
  getTimestamp?(): string;
  disable?: boolean;
  disableColors?: boolean;
}


export interface ILoggerHandler {
  log(color: Color, tag: string, args: any[]): void;
}

export interface ILoggerHandlerConstructor {
  new(options?: ILoggerHandlerOptions): ILoggerHandler;
}

export interface ILoggingOptions extends ILoggerHandlerOptions {
  logger?: ILoggerHandlerConstructor;
  logLevel?: LogLevel;
}