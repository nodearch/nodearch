import path from 'path';
import { App } from '@nodearch/core';
import { IKeycloakOptions } from './interfaces';

export class Keycloak extends App {
  constructor(options?: IKeycloakOptions) {
    super({
      classLoader: {
        classpath: path.join(__dirname, 'components')
      },
      externalConfig: options
    });
  }
}