import { Service } from '@nodearch/core';
import { OpenAPIObject } from 'openapi3-ts';
import { IOpenAPIProvider } from '../interfaces';


@Service({ export: true })
export class OpenAPI {

  private providers: IOpenAPIProvider[] = [];

  init(providers: IOpenAPIProvider[]) {
    this.providers = providers; 
  }

  get() {
    let openAPIObj: Partial<OpenAPIObject> = {};

    this.providers.forEach(provider => {
      openAPIObj = Object.assign(openAPIObj, provider.get())
    });

    return openAPIObj;
  }
}