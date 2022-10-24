import path from 'path';
import { App, LogLevel } from '@nodearch/core';


export default class Standalone extends App {
  constructor() {
    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      log: {
        logLevel: LogLevel.Debug
      },
      extensions: []
    });
  }
}

/**
 * TODO
 * - Update app options interface
 * - Use @App on the app class and path the app path 
 * - When loading we can associate @App to  it's file path so we can later load the package.json and get the App name and relative path
 * - think about how to pass the app config instead of calling super
 */ 