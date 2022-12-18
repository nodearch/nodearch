import path from 'path';
import { App } from '@nodearch/core';
import { ExpressApp, ExpressOAIProvider } from '@nodearch/express';
import { OpenAPI, OpenAPIApp, OpenAPIFormat } from '@nodearch/openapi';
import { SwaggerApp } from '@nodearch/swagger';
import { SwaggerUIBundle, SwaggerUIStandalonePreset, getAbsoluteFSPath } from 'swagger-ui-dist';

// SwaggerUIBundle({
//   url: '/docs/openapi.json'
// });


export default class MyApp extends App {
  constructor() {
    super({
      components: {
        path: path.join(__dirname, 'components')
      },
      extensions: [
        new ExpressApp({
          static: [
            { path: '/docs', root: './public/docs' },
            { path: '/docs', root: getAbsoluteFSPath() }
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
          path: './public/docs/openapi.json'
        }),
        new SwaggerApp({ openAPI: OpenAPI })
      ]
    });
  }
} 