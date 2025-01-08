import { App, ComponentScope} from '@nodearch/core';
import { IAwsSqsEventAppOptions } from './interfaces.js';


export class AwsSqsEventApp extends App {
  constructor(options: IAwsSqsEventAppOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url),
        scope: ComponentScope.SINGLETON
      },
      logs: {
        prefix: `SQS Q:${options.id}`
      },
      config: options
    });
  }
}
