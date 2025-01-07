import { Logger, Service } from '@nodearch/core';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, Message, ReceiveMessageCommandInput } from "@aws-sdk/client-sqs";
import { SQSEventConfig } from './sqs.config.js';
import util from 'node:util';
import { HandlerService } from './handler.service.js';

const sleep = util.promisify(setTimeout);


@Service()
export class SQSService {

  private sqsClient: SQSClient;
  private command: ReceiveMessageCommand;
  private polling: boolean;

  constructor(
    private config: SQSEventConfig,
    private logger: Logger,
    private handlerService: HandlerService
  ) {
    this.sqsClient = new SQSClient({ 
      region: this.config.awsRegion,
      credentials: this.config.awsCredentials
    });

    this.command = new ReceiveMessageCommand({
      QueueUrl: this.config.queueUrl,
      MaxNumberOfMessages: this.config.maxNumberOfMessages,
      VisibilityTimeout: this.config.visibilityTimeout,
      WaitTimeSeconds: this.config.waitTimeSeconds,
      MessageAttributeNames: this.config.messageAttributeNames,
      MessageSystemAttributeNames: this.config.messageSystemAttributeNames,
      ReceiveRequestAttemptId: this.config.receiveRequestAttemptId
    });

    this.polling = false;
  }

  async poll() {
    this.polling = true;

    while (this.polling) {
      try {
        await this.receiveMessages();
      }
      catch (error) {
        this.logger.error(`Error polling SQS`, error);
        await sleep(this.config.failuerBackoffMs);
      }
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
              QueueUrl: this.config.queueUrl,
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
    this.logger.info(`Processing Message: ${message.MessageId}`);

    if (message.Body && typeof message.Body === 'string') {
      try {
        message.Body = JSON.parse(message.Body);
      }
      catch (err) { /** Safe to ignore */ }
    }

    const handler = this.handlerService.getHandler(message);
  
    if (!handler) {
      throw new Error('No handler found that matches the message');
    }

    const handlerInstance = handler.componentInfo.getInstance();

    if (!handlerInstance.onMessage) {
      throw new Error(`No onMessage method found in the handler - ${handler.componentInfo.getClass().name}`);
    }

    await handlerInstance.onMessage(message);
  }
}
