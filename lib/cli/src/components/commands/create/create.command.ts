import { Command, CommandQuestion, ICommand, ICommandBuilder, QuestionType } from '@nodearch/command';
import { CodeGenerator } from '@nodearch/blueprints';
import { Logger } from '@nodearch/core';

@Command()
export class CreateCommand implements ICommand {
  command = 'create';
  describe = 'Create a new NodeArch component';
  availableTypes = ['Hook', 'Controller', 'Service', 'Repository', 'Component'];

  builder: ICommandBuilder = {
    type: {
      alias: 't',
      describe: 'Component type',
      choices: this.availableTypes
    },
    name: {
      alias: 'n',
      describe: 'Component name',

    },
    path: {
      alias: 'p',
      describe: 'Component directory path',
    }
  };

  questions: CommandQuestion[] = [
    {
      type: QuestionType.LIST,
      name: 'type',
      message: 'Select a component type',
      choices: this.availableTypes
    },
    {
      type: QuestionType.INPUT,
      name: 'name',
      message: 'Enter the component name',
      default: 'user',
      validate: (input: any) => {
        if (!input) {
          return 'Component name is required';
        }
        return true;
      }
    },
    {
      type: QuestionType.INPUT,
      name: 'path',
      message: 'Enter the component directory path',
      validate: (input: any) => {
        if (!input) {
          return 'Component directory path is required';
        }
        return true;
      }
    }
  ];

  constructor(private readonly logger: Logger) {}

  async handler(options: Record<string, any>) {
    const codeGenerator = new CodeGenerator();

    switch (options.type) {
      case 'Hook':
        await codeGenerator.hook(options.name, {}, options.path);
        break;
      case 'Controller':
        await codeGenerator.controller(options.name, {}, options.path);
        break;
      case 'Service':
        await codeGenerator.service(options.name, {}, options.path);
        break;
      case 'Repository':
        await codeGenerator.repository(options.name, {}, options.path);
        break;
      case 'Component':
        await codeGenerator.component(options.name, {}, options.path);
        break;
      default:
        this.logger.error('Invalid component type');
        break;
    }

  }

}