import { Command, ICommand, ICommandHandlerOptions, Logger } from '@nodearch/core';
import { IOpenAPICommandOptions, OpenAPIFormat } from '../interfaces';
import { OpenApiBuilder } from 'openapi3-ts';
import { OpenAPI } from './openapi';
import path from 'path';
import fs from 'fs/promises';
import { OpenAPIConfig } from './openapi.config';


@Command({ export: true })
export class OpenAPICommand implements ICommand<IOpenAPICommandOptions> {
  command = 'openapi:generate';
  describe = 'Generate OpenAPI Document';

  builder = {
    format: {
      describe: 'Select in which format you\'d like to generate the OpenAPI document',
      choices: ['json', 'yaml'],
      default: 'json'
    },
    path: {
      describe: 'Absolute/relative path to where the generated OpenAPI will be saved',
      type: 'string',
      required: false
    }
  };

  constructor(
    private readonly openAPI: OpenAPI,
    private readonly logger: Logger,
    private readonly config: OpenAPIConfig
  ) {}

  async handler(options: ICommandHandlerOptions<IOpenAPICommandOptions>) {
    const format = this.config.format || options.data.format;
    let filePath = this.config.path || options.data.path;

    const fileExtensions = Object.values(OpenAPIFormat).map(ft => '.' + ft);
    let specs: string = '';

    const builder = OpenApiBuilder
      .create(this.openAPI.get());

    if (format === OpenAPIFormat.Json) {
      specs = JSON.stringify(JSON.parse(builder.getSpecAsJson()), null, 2);
    }
    else {
      specs = builder.getSpecAsYaml();
    }

    if (!filePath) {
      filePath = path.join(options.appInfo!.paths.root, 'openapi.' + format);
    }
    else {
      filePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      
      const fileExt = path.parse(filePath).ext as OpenAPIFormat;

      if (!fileExtensions.includes(fileExt)) {
        filePath = path.join(filePath, 'openapi.' + format);
      }
    }


    await fs.mkdir(path.parse(filePath).dir, { recursive: true });
    await fs.writeFile(filePath, specs);

    this.logger.info(`OpenAPI document generated and saved to: ${filePath}`);
  }
}