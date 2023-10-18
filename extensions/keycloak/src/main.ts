import { App } from '@nodearch/core';
import { IKeycloakOptions } from './interfaces.js';


export class KeycloakApp extends App {
  constructor(config?: IKeycloakOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      config
    });
  }
}