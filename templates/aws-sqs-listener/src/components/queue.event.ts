import { ISqsEvent, SQSEvent, SqsMatching } from '@nodearch/aws-sqs-event';
import { Message } from '@aws-sdk/client-sqs';


@SQSEvent({
  id: 'sqs-listener'
})
export class QueueEvent implements ISqsEvent {
  async onMessage(event: Message) {
    console.log('Received event:', event);
  }
}