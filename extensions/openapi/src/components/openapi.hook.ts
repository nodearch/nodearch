import { Hook, HookContext, IHook } from '@nodearch/core';
import { IOpenAPIProvider } from '../interfaces';
import { OpenAPI } from './openapi';
import { OpenAPIConfig } from './openapi.config';


@Hook({ export: true })
export class OpenAPIHook implements IHook {
  
  constructor(
    private readonly openAPIConfig: OpenAPIConfig,
    private readonly openAPI: OpenAPI
  ) {}
  
  async onInit(context: HookContext) {
    const providers: IOpenAPIProvider[] = [];

    this.openAPIConfig.providers.forEach(provider => {
      const oaiProvider = context.get<IOpenAPIProvider>(provider);
      
      if (oaiProvider) {
        providers.push(oaiProvider);
      }
    });

    this.openAPI.init(providers);
  }
}