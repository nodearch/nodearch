import path from 'node:path';
import fs from 'node:fs/promises';
import { IFile, IFileInfo } from './interfaces.js';
import { FileType } from './enums.js';
import { fileURLToPath } from 'node:url';


export class FileLoader {
  static async loadFiles(filesInfo: IFileInfo[]) {
    return Promise.all(
      filesInfo.map(async fileInfo => {
        const fileContent = await FileLoader.importModule(fileInfo.path);

        (<IFile>fileInfo).content = fileContent;

        return <IFile>fileInfo;
      })
    );
  }

  static filterFiles(filesInfo: IFileInfo[], include: string[], exclude: string[]) {
    return filesInfo.filter(item => {
      return FileLoader.isFileNameMatching(item.base, include, exclude);
    });
  }

  /**
   * Get a list of all files within a directory
   */
  static async getDirFilesList(url: URL, include: string[], exclude: string[]): Promise<IFileInfo[]> {
    const dirContent = await fs.readdir(url);
    // TODO: filter files&folders by include and exclude?
    return Promise.all(
      dirContent.map(async (item) => {
        const itemUrl = new URL(item, url);
        const itemPath = fileURLToPath(itemUrl);

        const parsedPath = path.parse(itemPath);

        let itemType;

        const stat = await fs.lstat(itemPath);

        if (stat.isDirectory()) {
          itemType = FileType.Directory;
        }
        else if (stat.isFile()) {
          itemType = FileType.File;
        }
        else {
          itemType = FileType.Other;
        }

        return {
          url: itemUrl,
          path: itemPath,
          ...parsedPath,
          type: itemType
        };
      })
    );
  }

  /**
   * Get a list of all files within a directory and all of it's subdirectories
   * down to a specified depth
   */
  static async getFilesList(dirUrl: URL, depth: number = 1, include: string[], exclude: string[]) {
    if (depth <= 0) {
      return [];
    }

    let content: IFileInfo[] = [];
    const dirContent = await FileLoader.getDirFilesList(dirUrl, include, exclude);

    content = content.concat(
      ...await Promise.all(
        dirContent.map(async (file) => {
          if (file.type === FileType.Directory) {
            return [file, ...await FileLoader.getFilesList(file.url, depth - 1, include, exclude)];
          }
          else {
            return [file];
          }
        })
      )
    );

    return content;
  }

  /**
   * 1. escape regex special chars from user input except *
   * 2. replaces * with regex ( all chars except line break )
   */
  static getFileNameMatcher(exp: string): RegExp {
    return new RegExp(`^${exp.replace(/[.+\-?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^\\n]+')}$`, 'g');
  }

  static isFileNameMatching(fileName: string, include: string[], exclude: string[]) {
    const isExcluded = exclude.some((exp) => {
      const rgx = FileLoader.getFileNameMatcher(exp);
      return fileName.match(rgx);
    });

    if (isExcluded) return false;

    return include.some((exp) => {
      const rgx = FileLoader.getFileNameMatcher(exp);
      return fileName.match(rgx);
    });
  }

  static async importModule(url: URL) {
    return await import(fileURLToPath(url));
  }

  static async importJSON(url: URL) {
    return JSON.parse(await fs.readFile(url, 'utf8'));
  }
}