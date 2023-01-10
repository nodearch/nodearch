import { ClassConstructor } from '../utils/types.js';
import { FileSystem } from './file-system.js';
import { IClassLoaderOptions, IFile } from './interfaces.js';


export class ClassLoader {
  classes: ClassConstructor[];

  private path?: string;
  private depth: number;
  private include: string[];
  private exclude: string[];

  constructor(options: IClassLoaderOptions) {
    this.classes = options.classes || [];
    this.path =  options.path;

    this.include = ['*.js', '*.ts'];
    this.exclude = ['*.d.ts', '*.spec.ts', '*.e2e-spec.ts', '*.spec.js', '*.e2e-spec.ts'];
    this.depth = options.depth || 10;


    // TODO: remove this after validation it won't be needed
    // if (!this.classpath && (!options.classes || !options.classes.length)) {
    //   throw new Error('Requires either classpath or classes configurations to be present');
    // }
  }

  async load() {
    if (this.path) {
      const filesInfo = await FileSystem.readFiles(this.path, this.depth);

      const filteredFilesInfo = FileSystem.filterFiles(filesInfo, this.include, this.exclude);
      
      const files = await FileSystem.loadFiles(filteredFilesInfo);

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