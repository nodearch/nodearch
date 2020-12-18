import { IFile, IClassLoaderOptions, IFileLoaderOptions } from './interfaces';
import { ClassConstructor } from '../utils';
import { FileSystem } from './file-system';

export class ClassLoader {

  private classpath?: string;
  private filesOptions: Required<IFileLoaderOptions>;
  classes: ClassConstructor[];

  constructor(options: IClassLoaderOptions = {}) {
    this.classes = options.classes || [];
    this.classpath =  options.classpath;

    this.filesOptions = {
      include: options.files?.include || ['*.js', '*.ts'],
      exclude: options.files?.exclude || ['*.d.ts', '*.spec.ts', '*.e2e-spec.ts', '*.spec.js', '*.e2e-spec.ts'],
      deep: 5
    };

    if (!this.classpath && (!options.classes || !options.classes.length)) {
      throw new Error('Requires either classpath or classes configurations to be present');
    }
  }

  async load() {
    if (this.classpath) {
      const filesInfo = await FileSystem.readFiles(this.classpath, this.filesOptions.deep);

      const filteredFilesInfo = FileSystem.filterFiles(filesInfo, this.filesOptions.include, this.filesOptions.exclude);
      
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
