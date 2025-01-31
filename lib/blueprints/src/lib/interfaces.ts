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

export interface IComponentTs {
  className: string;
  imports: {
    moduleName: string;
    imported: string[];
  }[];
  classDecorators: {
    name: string;
    options?: {
      key: string;
      value: any;
    }[];
  }[];
}

export interface IReadmeMd {
  title: string;
  description: string;
}

export interface IDotEnv {
  envVars: {
    name: string;
    value: string | number | boolean;
  }[];
}

export interface IVscodeSettingsJson {
  eslint: boolean;
}