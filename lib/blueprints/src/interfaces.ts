export type TLogger = (msg: string, location: string) => void;

export interface IAppGeneratorOptions {
  appName: string;
  appDescription: string;
  extensions?: IExtensionsTemplateData;
}

export interface IExtensionsTemplateData {
  express?: boolean;
  mocha?: boolean;
}

export interface IMainTs {
  className: string;
  logPrefix: string;
  title: string;
  hideExtensions?: boolean;
  extensions: IExtensionsTemplateData;
}

export interface IPackageJson {
  packageName: string;
  packageDescription?: string;
  extensions: IExtensionsTemplateData;
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

export interface IHookTs {
}

export interface IControllerTs {
}

export interface IServiceTs {
}

export interface IRepositoryTs {
}

export interface IComponentTs {
}