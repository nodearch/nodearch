import { AppContext, Service } from '@nodearch/core';
import { IOpenAPIAppMapItem, IOpenAPIProvider, OAISchema, OpenApiAnnotation, IOpenAPIProviderData, IOpenAPIAppRouteMap } from '../index.js';

@Service({ export: true })
export class OAIBuiltInProvider implements IOpenAPIProvider {
  constructor(
    private readonly appContext: AppContext
  ) {}

  getData(): IOpenAPIProviderData {
    console.log('this.getTags()', this.getTags()[0].schema);
    return {
      servers: this.getServers(),
      routes: this.getTags()
    };
  }

  private getServers() {
    return this.getDecoratorsDefinitions(OpenApiAnnotation.Servers)
      .map(server => server.data)
      .flat(1);
  }

  // TODO: we need deep merge
  private getTags(): any {
    return this.getDecoratorsDefinitions(OpenApiAnnotation.Tags)
      .map(tagsInfo => {
        /**
         * If method is not defined, then it means that the decorator
         * is applied to the class and we need to get all the methods 
         * of the class and create a route for each method
         */
        if (!tagsInfo.method) {
          return tagsInfo
            .componentInfo
            .getMethods()
            .map(method => {
              return {
                app: {
                  component: tagsInfo.componentInfo.getClass(),
                  method
                },
                schema: {
                  data: tagsInfo.data
                }
              };
            });
        }
        else {
          return {
            app: {
              component: tagsInfo.componentInfo.getClass(),
              method: tagsInfo.method
            },
            schema: {
              data: tagsInfo.data
            }
          };
        }
      })
      .flat(1)
      // TODO: remove this and add it to the above map
      .map(tagsInfo => {
        tagsInfo.schema.data = { tags: tagsInfo.schema.data }; 
        return tagsInfo;
      });
  }

  private getDecoratorsDefinitions(id: string) {
    return this.appContext
      .components
      .getDecoratorsById(id)
      .map(decoInfo => {
        return {
          componentInfo: decoInfo.componentInfo,
          method: decoInfo.method,
          data: decoInfo.data
        };
      }); 
  }
}