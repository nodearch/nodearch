import { Service } from '@nodearch/core';
import { spawn, exec } from 'child_process';

@Service()
export class CmdRunner {
  
  async run(command: string, cwd: string = process.cwd(), stdio: 'ignore' | 'pipe' | 'inherit' = 'inherit') {
    return new Promise((resolve, reject) => {

      const splittedCommand: string[] = command.split(' ');

      let cli = splittedCommand[0];

      const childProcess = spawn(cli, splittedCommand.slice(1), { stdio, cwd });
    
      childProcess.on('error', (error) => {
        reject(error);
      });
  
      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        }
      });

    });
  }

  async runNpm(args: string) {
    const cli = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    return this.run(`${cli} ${args}`);
  }

  async runNode(args: string) {
    return this.run(`node ${args}`);
  }

  async runTsc(args?: string) {
    return this.run(`node node_modules/typescript/bin/tsc${args? ' ' + args : ''}`);
  }

  async runMocha(args?: string) {
    return this.run(`node node_modules/mocha/bin/mocha${args? ' ' + args : ''}`);
  }
}