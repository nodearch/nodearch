import { CommandModule } from "yargs";

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