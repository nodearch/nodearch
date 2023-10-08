import { Service } from '@nodearch/core';
import axios from 'axios';
import path from 'path';
import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { ITemplateFile } from './interfaces.js';


@Service()
export class GitHubService {

  private readonly githubRepoUrl: string = 'https://api.github.com/repos/nodearch/nodearch/contents/';

  async listTemplates () {
    const dirsInfo = await this.getDirPathInfo('templates');
    return dirsInfo.map((x: any) => x.name);
  }

  async downloadTemplate(downloadPath: string, templateName: string) {

    const filesInfo = await this.getPathInfo('templates/' + templateName);

    await Promise.all(
      filesInfo.map(async fileInfo => {
        const filePath = fileInfo.path.split('/').slice(2).join('/');

        await fs.mkdir(path.join(downloadPath, path.parse(filePath).dir), { recursive: true });
        await this.downloadFile(path.join(downloadPath, filePath), fileInfo.download_url);
      })
    );

    await this.removeWorkspaceFromPackageJson(path.join(downloadPath, 'package.json'));
  }

  private async getDirPathInfo(repoPath: string) {
    const { data } = await axios({
      method: 'get',
      url: this.githubRepoUrl + repoPath,
      responseType: 'json'
    });

    return data.filter((x: any) => x.type === 'dir');
  }

  private async getPathInfo(repoPath: string) {

    let pathsInfo: ITemplateFile[] = [];

    const { data } = await axios({
      method: 'get',
      url: this.githubRepoUrl + repoPath,
      responseType: 'json'
    });

    const files = data.filter((x: any) => x.type === 'file');

    pathsInfo.push(...files);

    await Promise.all(
      data
        .filter((x: any) => x.type === 'dir')
        .map(async (x: any) => {
          const files = await this.getPathInfo(x.path);
          pathsInfo.push(...files);
        })
    );

    return pathsInfo;
  }

  private async downloadFile(filePath: string, downloadUrl: string) {
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream'
    });

    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);

      response.data.pipe(writeStream);

      writeStream.on('error', err => reject(err));
      
      writeStream.on('finish', () => resolve(true));
    });
  }

  private async removeWorkspaceFromPackageJson(filePath: string) {
    const packageJson = JSON.parse(await fs.readFile(filePath, 'utf8'));
  
    for (const depType of ['dependencies', 'devDependencies']) {
      const deps = packageJson[depType];
      if (!deps) {
        continue;
      }
  
      for (const depName in deps) {
        if (deps.hasOwnProperty(depName)) {
          const depVersion = deps[depName];
          if (depVersion.startsWith('workspace:')) {
            deps[depName] = depVersion.substring('workspace:'.length);
          }
        }
      }
    }
  
    await fs.writeFile(filePath, JSON.stringify(packageJson, null, 2));
  }
  

}