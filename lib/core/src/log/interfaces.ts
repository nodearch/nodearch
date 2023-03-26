import { LogLevel } from './enums.js';

export interface ILogger {
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
  setLogLevel(logLevel: LogLevel): void;
  getLogLevel(): LogLevel;
}

export interface ILoggerHandler {
  log(logLevel: LogLevel, timestamp: string, tag: string, args: any[]): void;
}

export interface ILoggerHandlerConstructor {
  new(): ILoggerHandler;
}

export interface ILogOptions {
  logger?: ILoggerHandlerConstructor;
  logLevel?: LogLevel;
  getTimestamp?(): string;
  disable?: boolean;
}