import { ParsedPath } from 'path';
import { FileType } from './enums';
import { ClassConstructor } from '../utils';


export interface IFileInfo extends ParsedPath {
  readonly path: string;
  readonly type: FileType;
}

export interface IFile extends IFileInfo {
  content: any;
}

export interface IFileLoaderOptions {
  deep?: number;
  include?: string[];
  exclude?: string[];
}
