import { 
  Command, CommandBuilder, 
  CommandQuestion, CommandQuestionType, 
  ICommand, Logger 
} from '@nodearch/core';
import path from 'path';
import { CommandMode } from '../cli/enum';
import { GitHubService } from '../utils/github.service';
import { NpmService } from '../utils/npm.service';


@Command()
export class NewCommand implements ICommand {
  private readonly currentDirectory: string;

  command: string;
  describe: string;
  aliases: string[];
  builder: CommandBuilder<any>;
  questions: CommandQuestion[];
  mode: CommandMode[];

  constructor(
    private readonly logger: Logger, 
    private readonly npmService: NpmService, 
    private readonly githubService: GitHubService
  ) {
    this.command = 'new';
    this.describe = 'Generate new NodeArch app';
    this.aliases = ['n'];
    this.builder = {
      name: {
        alias: ['n'],
        describe: 'Your project name'
      },
      template: {
        alias: ['t'],
        describe: 'Template to download'
      }
    };
    this.questions = [
      {
        type: CommandQuestionType.Input,
        name: 'name',
        message: 'Your project name?'
      },
      {
        type: CommandQuestionType.List,
        name: 'template',
        message: 'Select an app template',
        choices: async () => {
          return await this.githubService.listTemplates();
        }
      }
    ];
    this.mode = [CommandMode.NoApp];

    this.currentDirectory = process.cwd();
  }

  async handler(options: Record<string, any>) {
    try {
      const appName = this.formatName(options.name);

      const distPath = path.join(this.currentDirectory, appName);

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

  private formatName(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
