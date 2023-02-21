import { Service } from '@nodearch/core';
import { spawn } from 'node:child_process';

@Service()
export class TscService {
  async run(args: string[], cwd: string): Promise<void> {

    return new Promise((resolve, reject) => {

      const childProcess = spawn('node', ['node_modules/typescript/bin/tsc', ...args], { stdio: 'inherit', cwd });
    
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
}