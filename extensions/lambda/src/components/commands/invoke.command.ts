import { Command, ICommand, ICommandOptionsBuilder } from '@nodearch/command';
import { RegistryService } from '../registry.service.js';
import { Logger } from '@nodearch/core';
import fs from 'node:fs/promises';
import { LambdaService } from '../lambda.service.js';


@Command({ export: true })
export class LambdaCommand implements ICommand {

  constructor(
    private registryService: RegistryService,
    private logger: Logger,
    private lambdaService: LambdaService
  ) {}

  command = 'lambda-invoke';
  describe = 'Invoke Lambda function';

  builder: ICommandOptionsBuilder = {
    name: {
      describe: 'Lambda function name',
      demandOption: true,
      type: 'string'
    },
    event: {
      describe: 'Event data',
      type: 'string'
    },
    eventFile: {
      describe: 'Event data file',
      type: 'string',
      conflicts: 'event'
    }
  };

  async handler(args: any) {

    const name = args.name;
    const event = args.event || (args.eventFile ? await this.loadEventFile(args.eventFile) : {});

    try {
      
      const result = await this.lambdaService.invoke(name, event);
      this.logger.info(result);

    }
    catch (error: any) {
      this.logger.error(error.message);
    }
 
  }

  async loadEventFile(eventFile: string) {
    const event = await fs.readFile(eventFile, 'utf8');
    return JSON.parse(event);
  }

}