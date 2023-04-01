import path from 'node:path';
import { Command, QuestionType, ICommand } from '@nodearch/command';
import { GitHubService } from './github.service.js';
import { Logger } from '@nodearch/core';
import { NpmService } from './npm.service.js';


@Command()
export class NewCommand implements ICommand {

  constructor(
    private readonly githubService: GitHubService,
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
    }
  };
  questions = [
    {
      type: QuestionType.INPUT,
      name: 'name',
      message: 'Your project name?'
    },
    {
      type: QuestionType.LIST,
      name: 'template',
      message: 'Select an app template',
      choices: async () => {
        return await this.githubService.listTemplates();
      }
    }
  ];

  async handler(options: Record<string, any>) {
    try {
      const appName = options.name.toLowerCase().replace(/\s+/g, '-');

      const distPath = path.join(process.cwd(), appName);

      this.logger.info(`Generating a new app [${appName}] from the template [${options.template}]`);

      this.logger.info('Downloading the selected template');
  
      await this.githubService.downloadTemplate(distPath, options.template);
  
      this.logger.info('Installing template dependencies [Running npm i]');
  
      await this.npmService.install(distPath);
  
      this.logger.info('Initialization is complete. Your app is now ready to go, have fun!');
    }
    catch(e: any) {
      this.logger.error('Couldn\'t create your app', e.message);
    }
  }
}