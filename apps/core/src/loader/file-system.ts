import path from 'path';
import fs from 'fs';
import util from 'util';
import { IFileInfo, IFile } from './interfaces';
import { FileType } from './enums';


const fsAccess = util.promisify(fs.access);
const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);


export class FileSystem {
  static async loadFiles(filesInfo: IFileInfo[]) {
    return Promise.all(
      filesInfo.map(async fileInfo => {
        const fileContent = await FileSystem.importFile(fileInfo.path);

        (<IFile>fileInfo).content = fileContent;

        return <IFile>fileInfo;
      })
    );
  }

  static filterFiles(filesInfo: IFileInfo[], include: string[], exclude: string[]) {
    return filesInfo.filter(item => {
      return FileSystem.isFileNameMatching(item.base, include, exclude);
    });
  }

  static async readDir(dirPath: string): Promise<IFileInfo[]> {
    const dirContent = await readdir(dirPath);

    return Promise.all(
      dirContent.map(async (item) => {
        const itemPath = path.join(dirPath, item);

        const parsedPath = path.parse(itemPath);

        let itemType;

        const stat = await lstat(itemPath);

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

  static async readFiles(dirPath: string, deep: number = 1): Promise<IFileInfo[]> {
    if (deep <= 0) {
      return [];
    }

    let content: IFileInfo[] = [];
    const dirContent = await FileSystem.readDir(dirPath);

    content = content.concat(
      ...await Promise.all(
        dirContent.map(async (file) => {
          if (file.type === FileType.Directory) {
            return [file, ...await FileSystem.readFiles(file.path, deep--)];
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
      const rgx = FileSystem.getFileNameMatcher(exp);
      return fileName.match(rgx);
    });

    if (isExcluded) return false;

    return include.some((exp) => {
      const rgx = FileSystem.getFileNameMatcher(exp);
      return fileName.match(rgx);
    });
  }

  static findUpSync(fileName: string, searchPath?: string): string | undefined {
    let searchDir = searchPath || process.cwd();
    let foundDir = null;
    let isSearch = true;

    while (isSearch) {
      const result = fs.existsSync(path.join(searchDir, fileName));
      const parentDir = path.join(searchDir, '..');
      if (!result && parentDir !== searchDir) {
        searchDir = parentDir;
      }
      else if (!result && parentDir === searchDir) {
        // not found.
        isSearch = false;
      }
      else {
        // found.
        foundDir = searchDir;
        isSearch = false;
      }
    }

    return foundDir ? path.join(foundDir, fileName) : undefined;
  }

  static async findUp(fileName: string, searchPath?: string): Promise<string | undefined> {
    let searchDir = searchPath || process.cwd();
    let foundDir = null;
    let isSearch = true;

    while (isSearch) {
      const result = await FileSystem.access(path.join(searchDir, fileName));
      const parentDir = path.join(searchDir, '..');
      if (!result && parentDir !== searchDir) {
        searchDir = parentDir;
      }
      else if (!result && parentDir === searchDir) {
        // not found.
        isSearch = false;
      }
      else {
        // found.
        foundDir = searchDir;
        isSearch = false;
      }
    }

    return foundDir ? path.join(foundDir, fileName) : undefined;
  }

  static async access(filePath: string) {
    return fsAccess(filePath, fs.constants.F_OK)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  static async importFile(filePath: string) {
    return import(filePath);
  }

  static importFileSync(filePath: string) {
    return module.require(filePath);
  }
}