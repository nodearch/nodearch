import { Logger, Service } from '@nodearch/core';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, Message } from "@aws-sdk/client-sqs";
import { SQSConfig } from './sqs.config.js';


@Service()
export class SQSService {

  private sqsClient: SQSClient;
  private command: ReceiveMessageCommand;
  private polling: boolean;

  constructor(
    private config: SQSConfig,
    private logger: Logger
  ) {
    this.sqsClient = new SQSClient({ region: this.config.awsRegion });
    this.command = new ReceiveMessageCommand({
      QueueUrl: this.config.sqsQueueUrl,
      MaxNumberOfMessages: this.config.maxNumberOfMessages, // Number of messages to retrieve
      VisibilityTimeout: this.config.visibilityTimeout, // Time the message stays invisible after being received
      WaitTimeSeconds: this.config.waitTimeSeconds // Long polling duration
    });

    this.polling = false;
  }

  async poll() {
    this.polling = true;

    try {
      while (this.polling) {
        await this.receiveMessages();
      }
    }
    catch (error) {
      this.logger.error('Error polling SQS', error);
    }
    finally {
      this.polling = false;
    }
  }

  async stop() {
    this.polling = false;
  }

  private async receiveMessages() {
    const result = await this.sqsClient.send(this.command);
    
    if (result.Messages) {
      for (const message of result.Messages) {
        this.logger.info(`Message Received: ${message.MessageId}`);

        try {
          await this.processMessage(message);

          if (message.ReceiptHandle) {
            const deleteCommand = new DeleteMessageCommand({
              QueueUrl: this.config.sqsQueueUrl,
              ReceiptHandle: message.ReceiptHandle
            });
    
            await this.sqsClient.send(deleteCommand);
            this.logger.info(`Message Deleted: ${message.MessageId}`);
          }
        }
        catch (error) {
          this.logger.error(`Error processing message: ${message.MessageId}`, error);
        }
      }
    }
  }

  private async processMessage(message: Message) {

  }
}
