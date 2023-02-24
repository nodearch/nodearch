import { ParsedPath } from 'path';
import { ClassConstructor } from '../utils/types.js';
import { AppLoadMode, FileType } from './enums.js';



export interface IFileInfo extends ParsedPath {
  readonly url: URL;
  readonly path: string;
  readonly type: FileType;
}

export interface IFile extends IFileInfo {
  content: any;
}

export interface IClassLoaderOptions {
  classes?: ClassConstructor[];
  url?: URL;
  depth?: number;
  include?: (RegExp | string)[];
  exclude?: (RegExp | string)[];
}

export interface IAppLoaderOptions {
  // Current working directory
  cwd?: URL;

  // Name of the tsconfig file (e.g. 'tsconfig.json')
  tsConfig?: string;
  
  // Entry file name without extension (e.g. 'main')
  appEntry?: string;

  // App load mode (e.g. 'ts' or 'js')
  appLoadMode?: AppLoadMode;
}