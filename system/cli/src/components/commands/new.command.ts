
import { Logger, CLI, ICLI, CLIBuilder, CLIQuestion, CLIQuestionType } from '@nodearch/core';
import path from 'path';
import { NpmService } from '../npm';
import ora from 'ora';
import { GitHubDownloader } from '../github-downloader';


@CLI()
export class NewCommand implements ICLI {
  private readonly currentDirectory: string;

  command: string;
  describe: string;
  aliases: string[];
  builder: CLIBuilder;
  questions: CLIQuestion[];

  constructor(
    private readonly logger: Logger, 
    private readonly npmService: NpmService, 
    private readonly gitHubDownloader: GitHubDownloader
  ) {
    this.command = 'new';
    this.describe = 'Generate new NodeArch APP';
    this.aliases = ['n'];
    this.builder = {
      name: {
        alias: ['n'],
        describe: 'project name'
      },
      template: {
        alias: ['t'],
        describe: 'template to download'
      }
    };
    this.questions = [
      {
        type: CLIQuestionType.Input,
        name: 'name',
        message: `project name ? `
      },
      {
        type: CLIQuestionType.List,
        name: 'template',
        choices: async () => {
          return await this.gitHubDownloader.listTemplates();
        }
      }
    ];

    this.currentDirectory = process.cwd();
  }

  async handler(data: any) {

    const spinner = ora({ spinner: 'dots' });

    try {
      const distPath = path.join(this.currentDirectory, data.name);

      spinner.start('Downloading APP template...');
  
      await this.gitHubDownloader.downloadTemplate(distPath, data.template);
  
      spinner.succeed('APP template downloaded!');
  
      spinner.start('Installing dependencies...');
  
      await this.npmService.install(distPath);
  
      spinner.succeed(`Dependencies installed, your new APP is ready, Have fun!`);
    }
    catch(e) {
      spinner.fail('Failed to create new APP!');
      this.logger.error(e);
    }
  }
}
