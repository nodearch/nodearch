import { App } from '@nodearch/core';
import { IKeycloakOptions } from './interfaces.js';


export class Keycloak extends App {
  constructor(options?: IKeycloakOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config: {
        externalConfig: options
      }
    });
  }
}