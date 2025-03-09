import path from 'node:path';
import { Command, QuestionType, ICommand } from '@nodearch/command';
import { Logger } from '@nodearch/core';
import { NpmService } from './npm.service.js';
import { CodeGenerator } from '@nodearch/blueprints';


@Command()
export class NewCommand implements ICommand {

  constructor(
    private readonly npmService: NpmService,
    private readonly logger: Logger
  ) {}

  command = 'new';
  describe = 'Generate new NodeArch app';
  aliases = 'n';
  builder = {
    name: {
      alias: 'n',
      describe: 'Your project name'
    },
    template: {
      alias: 't',
      describe: 'Template to download'
    },
    description: {
      alias: 'd',
      describe: 'Project description'
    }
  };

  questions = [
    {
      type: QuestionType.INPUT,
      name: 'name',
      message: 'Your project name?',
      validate: (input: any) => {
        if (!input) {
          return 'Project name is required';
        }
        return true;
      }
    },
    {
      type: QuestionType.INPUT,
      name: 'description',
      message: 'Project description',
      validate: (input: any) => {
        if (!input) {
          return 'Project description is required';
        }
        return true;
      }
    },
    {
      type: QuestionType.LIST,
      name: 'template',
      message: 'Select an app template',
      choices: ['Standard', 'Express']
    }
  ];

  async handler(options: Record<string, any>) {
    try {
      const appName = options.name.toLowerCase().replace(/\s+/g, '-');

      const distPath = path.join(process.cwd(), appName);

      this.logger.info(`Generating a new app [${appName}] from the template [${options.template}]`);

      const codeGenerator = new CodeGenerator();

      switch (options.template) {
        case 'Standard':
          await codeGenerator.app({
            appName: appName,
            appDescription: options.description,
            extensions: {
              mocha: true
            }
          }, distPath);
          break;
        case 'Express':
          await codeGenerator.app({
            appName: appName,
            appDescription: options.description,
            extensions: {
              express: true,
              mocha: true
            }
          }, distPath);
          break;
        default:
          this.logger.error('Invalid template selected');
          return;
      }
  
      this.logger.info('Installing template dependencies [Running npm i]');
  
      await this.npmService.install(distPath);
  
      this.logger.info('Initialization is complete. Your app is now ready to go, have fun!');
    }
    catch(e: any) {
      this.logger.error('Couldn\'t create your app', e.message);
    }
  }
}