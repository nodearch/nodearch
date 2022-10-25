import { IFile, IFileLoaderOptions } from './interfaces';
import { ClassConstructor } from '../utils';
import { FileSystem } from './file-system';

export class ClassLoader {

  private path: string;
  classes: ClassConstructor[];

  constructor(path: string) {
    this.classes = [];
    this.path = path;
  }

  async load() {
    const filesInfo = await FileSystem.readFiles(this.path, 50);

    const filteredFilesInfo = FileSystem.filterFiles(filesInfo, ['*.js', '*.ts'], ['*.d.ts']);
    const files = await FileSystem.loadFiles(filteredFilesInfo);

    this.loadClassesFromFiles(files);
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
