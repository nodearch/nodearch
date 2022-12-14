import { Command, ICommand, ICommandHandlerOptions } from '@nodearch/core';
import { IOpenAPICommandOptions } from '../interfaces';
import { OpenApiBuilder } from 'openapi3-ts';
import { OpenAPI } from './openapi';


@Command({ export: true })
export class OpenAPICommand implements ICommand<IOpenAPICommandOptions> {
  command = 'openapi:generate';
  describe = 'Generate OpenAPI Document';

  builder = {
    format: {
      describe: 'Select in which format you\'d like to generate the OpenAPI document',
      choices: ['json', 'yaml'],
      default: 'json'
    }
  };
  // questions?: CommandQuestion<any>[] | undefined;
  // npmDependencies?: INpmDependency[] | undefined;
  // mode?: CommandMode[] | undefined;

  constructor(
    private readonly openAPI: OpenAPI
  ) {}

  async handler(options: ICommandHandlerOptions<IOpenAPICommandOptions>) {
    const format = options.data.format;
    let specs: string = '';

    const builder = OpenApiBuilder
      .create(this.openAPI.get());

    if (format === 'json') {
      specs = builder.getSpecAsJson();
    }
    else {
      specs = builder.getSpecAsYaml();
    }

    console.log(specs);
  }
}