import { Hook, IHook } from '@nodearch/core';
import { SQSConfig } from './sqs.config.js';

@Hook({ export: true })
export class SQSHook implements IHook {

  constructor(
    private sqsConfig: SQSConfig,
  ) {}

  async onStart() {
    if (this.sqsConfig.isListening) {
      
    }
  }

  async onStop() {

  }
}
