import { Service } from '@nodearch/core';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

interface ITemplateFile {
  name: string;
  path: string;
  download_url: string;
}


@Service()
export class GitHubDownloader {

  private readonly githubRepoUrl: string = 'https://api.github.com/repos/bluemax-io/nodearch/contents/';

  async listTemplates () {
    const dirsInfo = await this.getDirPathInfo('template');
    return dirsInfo.map((x: any) => x.name);
  }

  async downloadTemplate(downloadPath: string, templateName: string) {

    const filesInfo = await this.getPathInfo('template/' + templateName);

    await Promise.all(
      filesInfo.map(async fileInfo => {
        const filePath = fileInfo.path.split('/').slice(2).join('/');

        await fs.promises.mkdir(path.join(downloadPath, path.parse(filePath).dir), { recursive: true });
        await this.downloadFile(path.join(downloadPath, filePath), fileInfo.download_url);
      })
    );
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
      const writeStream = fs.createWriteStream(filePath);

      response.data.pipe(writeStream);

      writeStream.on('error', err => reject(err));
      
      writeStream.on('finish', () => resolve(true));
    });
  }
}