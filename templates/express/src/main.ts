import { App } from '@nodearch/core';
import { ExpressApp, ExpressOAIProvider } from '@nodearch/express';
import { JoiApp } from '@nodearch/joi';
import { JoiExpressApp, JoiOpenApiProvider } from '@nodearch/joi-express';
import { OpenAPIApp, OpenAPIFormat } from '@nodearch/openapi';
import { SwaggerApp } from '@nodearch/swagger';
import { getAbsoluteFSPath } from 'swagger-ui-dist';
import { MochaApp } from '@nodearch/mocha';
import Joi from 'joi';


export default class MyApp extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      extensions: [
        new ExpressApp({
          httpPath: '/api',
          static: [
            { httpPath: '/docs', filePath: './public/docs' },
            { httpPath: '/docs', filePath: getAbsoluteFSPath() }
          ],
          httpErrors: {
            customErrors: [
              {
                error: Joi.ValidationError,
                handler: (error, res) => {
                  res.status(400).json({ message: error.message, details: error.details });
                }
              }
            ]
          },
        }),
        new OpenAPIApp({
          providers: [ExpressOAIProvider, JoiOpenApiProvider],
          openAPI: {
            info: {
              title: 'NodeArch Express Template',
              version: '0.1.0'
            }
          },
          format: OpenAPIFormat.Json,
          path: './public/docs/openapi.json'
        }),
        new SwaggerApp({
          url: '/docs/openapi.json'
        }),
        new JoiApp(),
        new JoiExpressApp(),
        new MochaApp()
      ],
      logs: {
        prefix: 'MyApp'
      }
    });
  }
}