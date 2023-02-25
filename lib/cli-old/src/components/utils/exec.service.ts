import { Service } from '@nodearch/core';
import { spawn } from 'child_process';
import path from 'path';


@Service()
export class ExecService {

  private tsNodePath: string;

  constructor() {
    this.tsNodePath = path.join(__dirname, '..', '..', '..', 'node_modules', 'ts-node', 'dist', 'bin.js');
  }

  async tsNode(code: string, cwd: string = process.cwd(), stdio: 'ignore' | 'pipe' | 'inherit' = 'inherit') {
    return new Promise((resolve, reject) => {
  
      const childProcess = spawn('node', [this.tsNodePath, '--transpileOnly', '-e', code], { stdio, cwd });
    
      childProcess.on('error', (error) => {
        reject(error);
      });
  
      childProcess.on('close', (exitCode) => {
        if (exitCode === 0) {
          resolve(true);
        }
      });
  
    });
  }
}