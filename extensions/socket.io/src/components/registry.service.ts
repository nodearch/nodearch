import { Logger, Service } from '@nodearch/core';
import { ParserService } from './parser.service.js';


@Service()
export class RegistryService {
  constructor(
    private readonly logger: Logger,
    private readonly parser: ParserService 
  ) {}


  register() {
    const namespacesMap = this.parser.parse();

    console.log(namespacesMap);
  }
}