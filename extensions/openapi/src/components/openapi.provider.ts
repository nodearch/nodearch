import { AppContext, Service } from '@nodearch/core';
import { IOpenAPIAppMapItem, IOpenAPIProvider, OAISchema, OpenApiAnnotation, IOpenAPIProviderData, IOpenAPIAppRouteMap } from '../index.js';

@Service({ export: true })
export class OAIBuiltInProvider implements IOpenAPIProvider {
  constructor(
    private readonly appContext: AppContext
  ) { }

  getData(): IOpenAPIProviderData {
    return {
      servers: this.getServers(),
      routes: [
        ...this.getTags(),
        ...this.getResponses(),
        ...this.getRequestBody(),
        ...this.getRouteInfo()
      ]
    };
  }

  private getServers() {
    return this.getDecoratorsDefinitions(OpenApiAnnotation.Servers)
      .map(server => server.data)
      .flat(1);
  }

  private getTags() {
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
                  data: { tags: tagsInfo.data }
                }
              };
            });
        }
        else {
          return {
            app: {
              component: tagsInfo.componentInfo.getClass(),
              method: tagsInfo.method as string
            },
            schema: {
              data: { tags: tagsInfo.data }
            }
          };
        }
      })
      .flat(1);
  }

  private getResponses() {
    return this.getDecoratorsDefinitions(OpenApiAnnotation.Responses)
      .map(responses => {

        return {
          app: {
            component: responses.componentInfo.getClass(),
            method: responses.method as string
          },
          schema: {
            data: { responses: responses.data }
          }
        };

      });
  }

  private getRequestBody() {
    return this.getDecoratorsDefinitions(OpenApiAnnotation.RequestBody)
      .map(responses => {

        return {
          app: {
            component: responses.componentInfo.getClass(),
            method: responses.method as string
          },
          schema: {
            data: { requestBody: responses.data }
          }
        };

      });
  }

  private getRouteInfo() {
    return this.getDecoratorsDefinitions(OpenApiAnnotation.RouteInfo)
    .map(routeInfo => {

      const entries: any = [];

      for (const [key, value] of Object.entries(routeInfo.data)) {
        const data: any = {};
        data[key] = value;

        entries.push({
          app: {
            component: routeInfo.componentInfo.getClass(),
            method: routeInfo.method as string
          },
          schema: {
            data
          }
        });
      }

      return entries;

    })
    .flat(1);
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