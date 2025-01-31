export interface IMainTs {
  className: string;
  logPrefix: string;
  extensions: {
    name: string;
    options?: {
      key: string;
      value: any;
    }[];
  }[];
  imports: {
    moduleName: string;
    imported: string[];
  }[];
}

export interface IPackageJson {
  packageName: string;
  packageDescription?: string;
  scripts: {
    name: string;
    command: string;
  }[];
  devDependencies: {
    name: string;
    version: string;
  }[];
  dependencies: {
    name: string;
    version: string;
  }[];
}