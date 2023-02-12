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

  static async readDir(dirPath: URL): Promise<IFileInfo[]> {
    const dirContent = await fs.readdir(dirPath);

    return Promise.all(
      dirContent.map(async (item) => {
        const itemPath = fileURLToPath(new URL(item, dirPath));

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

  // static findUpSync(fileName: string, searchPath?: string): string | undefined {
  //   let searchDir = searchPath || process.cwd();
  //   let foundDir = null;
  //   let isSearch = true;

  //   while (isSearch) {
  //     const result = fs.existsSync(path.join(searchDir, fileName));
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

  static async findUp(fileName: string, searchPath?: string): Promise<string | undefined> {
    let searchDir = searchPath || process.cwd();
    let foundDir = null;
    let isSearch = true;

    while (isSearch) {
      const result = await FileLoader.access(path.join(searchDir, fileName));
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
    return fs.access(filePath, fs.constants.F_OK)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  static async importFile(filePath: URL) {
    return await import(filePath);
  }

  static importFileSync(filePath: string) {
    return module.require(filePath);
  }

  static resolvePath(strPath: string, to?: string) {
    return path.normalize(path.resolve(to || process.cwd(), strPath));
  }

  static resolvePaths(paths: Record<string, string>, to?: string) {
    const resolvedPaths: Record<string, string> = {};
    
    for (const p in paths) {
      resolvedPaths[p] = FileLoader.resolvePath(paths[p], to);
    }

    return resolvedPaths;
  }

  static async importJSON(filePath: string) {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  }
}