import { CommandModule } from "yargs";
import { MethodsTypesDocs } from '@nodearch/core';

export interface IAppSettings {
  main: string;
}

export interface ICommand {
  command(subCommands?: CommandModule[]): CommandModule;
}

export interface ITemplateData {
  [key: string]: any;
}

export interface INewProjectConfig {
  name: string;
  path: string;
}

export interface IControllersTypes {
  [controller: string]: MethodsTypesDocs
}