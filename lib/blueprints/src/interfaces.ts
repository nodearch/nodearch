export type TLogger = (msg: string, location: string) => void;

export interface IStandardAppRecipeOptions {
  appName: string;
  appDescription: string;
}

export interface IMainTs {
  className: string;
  logPrefix: string;
  extensions: IAppExtension[];
  imports: IAppImport[];
}

export interface IAppExtension {
  name: string;
  options?: {
    key: string;
    value: any;
  }[];
}

export interface IAppImport {
  moduleName: string;
  imported: string[];
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
  interfaces?: string[];  // Add support for implementing interfaces
  methods?: IComponentMethod[];
}

export type ExtraComponentInfo = Partial<Omit<IComponentTs, 'className'>>

export interface IComponentMethod {
  name: string;
  parameters?: {
    name: string;
    type: string;
    decorators?: {
      name: string;
      options?: {
        key: string;
        value: any;
      }[];
    }[];
  }[];
  returnType?: string;
  body?: string;
  async?: boolean;
  decorators?: {
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