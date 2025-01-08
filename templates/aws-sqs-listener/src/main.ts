import { App, LogLevel } from '@nodearch/core';
import { AwsSqsEventApp } from '@nodearch/aws-sqs-event';


export default class SQSListener extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      logs: {
        logLevel: LogLevel.Debug,
        prefix: 'SQS Listener App'
      },
      extensions: [
        new AwsSqsEventApp({
          enabled: true,
          id: 'sqs-listener',
          queueUrl: ''
        })
      ]
    });
  }
}