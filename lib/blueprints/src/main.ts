import { App } from '@nodearch/core';

export class BlueprintsApp extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      extensions: [],
      logs: {
        prefix: 'Blueprints'
      }
    });
  }
}