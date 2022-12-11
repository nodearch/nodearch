import { Hook, HookContext, IHook } from '@nodearch/core';
import { OpenAPI } from '@nodearch/openapi';
import { SwaggerConfig } from './swagger.config';

// @Hook({ export: true })
// export class SwaggerHook implements IHook {

//   constructor(
//     private readonly swaggerConfig: SwaggerConfig
//   ) {}

//   async onStart(context: HookContext) {
//     console.log((context as any).container._bindingDictionary._map);
//     console.log('this.swaggerConfig.openAPI', this.swaggerConfig.openAPI);
//     const openAPI = context.get<OpenAPI>(this.swaggerConfig.openAPI);

//     if (openAPI) {
//       console.log(openAPI.get());    
//     }
//   }
// }