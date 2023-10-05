import { ClassConstructor } from '../utils/types.js';
import { FileLoader } from './file-loader.js';
import { IClassLoaderOptions, IFile } from './interfaces.js';


export class ClassLoader {
  classes: ClassConstructor[];

  private url?: URL;
  private depth: number;
  private include: (RegExp | string)[];
  private exclude: (RegExp | string)[];

  constructor(options: IClassLoaderOptions) {
    this.classes = options.classes || [];
    this.url =  options.url;
    this.include = options.include || ['*.js', '*.ts'];
    this.exclude = options.exclude || ['*.d.ts', '*.map'];
    this.depth = options.depth || 10;
  }

  async load() {
    if (this.url) {
      const filesInfo = await FileLoader.getFilesList(this.url, this.depth);

      const filteredFilesInfo = FileLoader.filterFiles(filesInfo, this.include, this.exclude);

      const files = await FileLoader.loadFiles(filteredFilesInfo);

      this.loadClassesFromFiles(files);
    }
  }

  private loadClassesFromFiles(filesInfo: IFile[]) {
    filesInfo.forEach(fileInfo => {
      if (fileInfo.content) {

        for(const classDefKey in fileInfo.content) {
          const item = fileInfo.content[classDefKey];
          if (typeof item === 'function') {
            if (!this.classes.find(x => x === item)) {
              this.classes.push(item);
            }
          }
        }

      }
    });
  }
}