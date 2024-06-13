import { Command, ICommand } from '@nodearch/command';
import { RegistryService } from '../registry.service.js';
import { Logger } from '@nodearch/core';


@Command({ export: true })
export class LambdaCommand implements ICommand {

  constructor(
    private registryService: RegistryService,
    private logger: Logger
  ) {}

  command = 'lambda list';
  describe = 'List Lambda functions';

  builder = {};

  async handler(args: any) {
    const lambdas = this.registryService.list();

    this.logger.info(`Available Lambda functions: ${lambdas.length}`);

    lambdas.forEach((lambda) => {
      this.logger.info(`Function: ${lambda}`);
    });

  }

}