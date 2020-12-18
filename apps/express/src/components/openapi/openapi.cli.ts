import { CLI, Logger, CLIQuestion, ICLI, CLIQuestionType, CLIBuilder } from '@nodearch/core';
import { OpenAPIParser } from './openapi.parser';
import { ServerConfig } from '../server.config';
import { OpenAPICliConfig } from './openapi.interfaces';
import fs from 'fs';
import path from 'path';

@CLI()
export class OpenAPICli implements ICLI {
  command: string;
  describe: string;
  builder: CLIBuilder;
  questions: CLIQuestion<OpenAPICliConfig>[];
  
  constructor(
    private readonly openAPIParser: OpenAPIParser,
    private readonly serverConfig: ServerConfig,
    private readonly logger: Logger
  ) {
    this.command = 'openapi';
    this.describe = 'Generate OpenAPI JSON File'
    this.builder = {
      path: {
        alias: 'p',
        describe: 'the directory path of openapi.json',
        default: this.serverConfig.openAPIOptions.jsonFilePath
      }
    }
    this.questions = [
      {
        type: CLIQuestionType.Input,
        name: 'path',
        message: `Please Enter the directory path of openapi.json file ? `,
        validate: async (value: string)  => {
          const isValidPath = await this.isJsonPathValid(value);

          return isValidPath || 'Please enter a valid directory path';
        }
      }
    ];
  }

  async handler(data: OpenAPICliConfig) {
    const openapi = this.openAPIParser.parse();
    const isValidPath = await this.isJsonPathValid(data.path);

    if (isValidPath) {
      await fs.promises.writeFile(
        path.join(data.path, 'openapi.json'),
        JSON.stringify(openapi, null, 2)
      );
      this.logger.info(`openapi.json file successfully generated in path ${data.path}`)
    }
    else {
      this.logger.error(`${data.path} is not a valid directory path`)
    }
  }

  private async isJsonPathValid(jsonPath: string): Promise<boolean> {
    try {
      return (await fs.promises.lstat(jsonPath)).isDirectory(); 
    } 
    catch {
      return false; 
    }
  }

}