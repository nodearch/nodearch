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
  log(options: ILoggerHandlerOptions): void;
}

export interface ILoggerHandlerOptions {
  logLevel: LogLevel; 
  timestamp: string; 
  args: any[];
  prefix?: string; 
}

export interface ILoggerHandlerConstructor {
  new(): ILoggerHandler;
}

export interface ILogOptions {
  logger?: ILoggerHandlerConstructor;
  logLevel?: LogLevel;
  getTimestamp?(): string;
  disable?: boolean;
  prefix?: string;
  disableColors?: boolean;
}