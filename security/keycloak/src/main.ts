import path from 'path';
import { App } from '@nodearch/core';
import { IKeycloakOptions } from './interfaces';
const pkg = require('../package.json');


export class Keycloak extends App {
  constructor(options?: IKeycloakOptions) {
    super({
      appInfo: {
        name: pkg.name,
        version: pkg.version
      },
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      config: {
        externalConfig: options
      }
    });
  }
}