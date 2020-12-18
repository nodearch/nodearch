
import { Logger, CLI, ICLI, CLIBuilder, CLIQuestion, CLIQuestionType } from '@nodearch/core';
import fs from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import decompress from 'decompress';
import { NpmService } from '../npm';
import ora from 'ora';


@CLI()
export class NewCommand implements ICLI {
  private readonly appDownloadUrl: string;
  private readonly currentDirectory: string;

  command: string;
  describe: string;
  aliases: string[];
  builder: CLIBuilder;
  questions: CLIQuestion[];

  constructor(private readonly logger: Logger, private readonly npmService: NpmService) {
    this.command = 'new';
    this.describe = 'Generate new NodeArch APP';
    this.aliases = ['n'];
    this.builder = {
      name: {
        alias: ['n'],
        describe: 'project name'
      }
    };
    this.questions = [
      {
        type: CLIQuestionType.Input,
        name: 'name',
        message: `project name ? `
      }
    ];

    this.appDownloadUrl = 'https://github.com/nodearch/app/archive/master.zip';
    this.currentDirectory = process.cwd();
  }

  async handler(data: any) {

    const spinner = ora({ spinner: 'dots' });

    try {
      const distPath = path.join(this.currentDirectory, data.name);

      spinner.start('Downloading APP template...');
  
      const downloadPath = await this.downloadApp();
  
      spinner.succeed('APP template downloaded!');
  
      spinner.start('Extracting APP Files...');
  
      await this.extractAppSource(downloadPath, distPath);
      await fs.promises.unlink(downloadPath);
  
      spinner.succeed('APP Files extracted!');
  
      spinner.start('Installing dependencies...');
  
      await this.npmService.install(distPath);
  
      spinner.succeed(`Dependencies installed, your new APP is ready, Have fun!`);
    }
    catch(e) {
      spinner.fail('Failed to create new APP!');
      this.logger.error(e);
    }
  }

  private async downloadApp() {
    const response = await axios({
      method: 'get',
      url: this.appDownloadUrl,
      responseType: 'stream'
    });


    const downloadPath = path.join(os.tmpdir(), 'nodearch-cli-nodearch-app.zip');

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(downloadPath);

      response.data.pipe(writeStream);

      writeStream.on('error', err => reject(err));
      
      writeStream.on('finish', () => resolve());
    });

    return downloadPath;
  }

  private async extractAppSource(srcPath: string, distPath: string) {
    await decompress(srcPath, distPath, { strip: 1 });
  }
}
