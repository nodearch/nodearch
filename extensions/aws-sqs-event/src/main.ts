import { App, ComponentScope} from '@nodearch/core';
import { IAWSSQSEventOptions } from './interfaces.js';


export class AWSSQSEvent extends App {
  constructor(options: IAWSSQSEventOptions) {
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
