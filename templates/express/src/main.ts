import { App } from '@nodearch/core';
import { ExpressApp, ExpressOAIProvider } from '@nodearch/express';
import { OpenAPIApp, OpenAPIFormat } from '@nodearch/openapi';
import { SwaggerApp, getAbsoluteFSPath } from '@nodearch/swagger';


export default class MyApp extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      extensions: [
        new ExpressApp({
          static: [
            { httpPath: '/docs', filePath: '../public/docs' },
            { httpPath: '/docs', filePath: getAbsoluteFSPath() }
          ]
        }),
        new OpenAPIApp({ 
          providers: [ExpressOAIProvider],
          openAPI: {
            info: {
              title: 'NodeArch Express Template',
              version: '0.1.0'
            }
          },
          format: OpenAPIFormat.Json,
          path: '../public/docs/openapi.json'
        }),
        new SwaggerApp({
          url: '/docs/openapi.json'
        })
      ]
    });
  }
} 