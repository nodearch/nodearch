import path from 'node:path';
import fs from 'node:fs/promises';
import { IFile, IFileInfo } from './interfaces.js';
import { FileType } from './enums.js';
import { fileURLToPath } from 'node:url';


export class FileLoader {
  static async loadFiles(filesInfo: IFileInfo[]) {
    return Promise.all(
      filesInfo.map(async fileInfo => {
        const fileContent = await FileLoader.importFile(fileInfo.path);

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

  static async readDir(url: URL): Promise<IFileInfo[]> {
    const dirContent = await fs.readdir(url);

    return Promise.all(
      dirContent.map(async (item) => {
        const itemPath = fileURLToPath(new URL(item, url));

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
          path: itemPath,
          ...parsedPath,
          type: itemType
        };
      })
    );
  }

  static async readFiles(dirPath: URL, deep: number = 1): Promise<IFileInfo[]> {
    if (deep <= 0) {
      return [];
    }

    let content: IFileInfo[] = [];
    const dirContent = await FileLoader.readDir(dirPath);

    content = content.concat(
      ...await Promise.all(
        dirContent.map(async (file) => {
          if (file.type === FileType.Directory) {
            return [file, ...await FileLoader.readFiles(file.path, deep - 1)];
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

  // static async findUp(fileName: string, searchDir?: URL): Promise<string | undefined> {
  //   searchDir = searchDir || new URL(process.cwd());
  //   let foundDir = null;
  //   let isSearch = true;

  //   while (isSearch) {
  //     const result = await FileLoader.access( path.join(searchDir, fileName));
  //     const parentDir = path.join(searchDir, '..');
  //     if (!result && parentDir !== searchDir) {
  //       searchDir = parentDir;
  //     }
  //     else if (!result && parentDir === searchDir) {
  //       // not found.
  //       isSearch = false;
  //     }
  //     else {
  //       // found.
  //       foundDir = searchDir;
  //       isSearch = false;
  //     }
  //   }

  //   return foundDir ? path.join(foundDir, fileName) : undefined;
  // }

  static async access(url: URL) {
    return fs.access(url, fs.constants.F_OK)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  static async importFile(url: URL) {
    return await import(fileURLToPath(url));
  }

  static async importJSON(url: URL) {
    return JSON.parse(await fs.readFile(url, 'utf8'));
  }
}