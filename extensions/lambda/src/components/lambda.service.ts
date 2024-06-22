import { Service } from '@nodearch/core';
import { RegistryService } from './registry.service.js';


@Service({ export: true })
export class LambdaService {

  constructor(
    private registryService: RegistryService
  ) {}

  async invoke(name: string, event: any) {
    const registrationInfo = this.registryService.get(name);

    if (!registrationInfo) {
      throw new Error(`Handler not found - ${name}`);
    }

    const { method, componentInfo } = registrationInfo;

    const instance = componentInfo.getInstance();

    return instance[method](event);
  }
}