import { AppContext, Logger } from '@nodearch/core';
import { Command, ICommand } from '@nodearch/command';
import { IOpenAPICommandOptions, OpenAPIFormat } from '../interfaces.js';
import { OpenApiBuilder } from 'openapi3-ts';
import { OpenAPI } from './openapi.js';
import path from 'path';
import fs from 'fs/promises';
import { OpenAPIConfig } from './openapi.config.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { UrlParser } from '@nodearch/core/fs';


@Command({ export: true })
export class OpenAPICommand implements ICommand<IOpenAPICommandOptions> {
  command = 'openapi generate';
  describe = 'Generate OpenAPI Document';

  builder = {
    format: {
      describe: 'Select in which format you\'d like to generate the OpenAPI document',
      choices: ['json', 'yaml']
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
    private readonly config: OpenAPIConfig,
    private readonly appContext: AppContext
  ) {} 

  async handler(options: IOpenAPICommandOptions) {
    const format = options.format || this.config.format || OpenAPIFormat.Json;

    let filePath = options.path || 
      this.config.path || 
      fileURLToPath(UrlParser.join(this.appContext.appInfo.paths.rootDir, 'openapi.' + format));

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

    filePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      
    const fileExt = path.parse(filePath).ext as OpenAPIFormat;

    if (!fileExtensions.includes(fileExt)) {
      filePath = path.join(filePath, 'openapi.' + format);
    }


    await fs.mkdir(path.parse(filePath).dir, { recursive: true });
    await fs.writeFile(filePath, specs);

    this.logger.info(`OpenAPI document generated and saved to: ${filePath}`);
  }
}