import { App, ComponentScope} from '@nodearch/core';
import { SQSClientOptions } from './interfaces.js';


export class AWSClientSQSApp extends App {
  constructor(options: SQSClientOptions) {
    super({
      components: {
        url: new URL('components', import.meta.url),
        scope: ComponentScope.SINGLETON
      },
      logs: {
        prefix: 'SQS Client'
      },
      config: options
    });
  }
}
