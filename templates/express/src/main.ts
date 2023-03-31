import { App } from '@nodearch/core';
import { ExpressApp, ExpressOAIProvider } from '@nodearch/express';
import { JoiApp } from '@nodearch/joi';
import Joi from 'joi';
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
          }
        }),
        new OpenAPIApp({ 
          providers: [ExpressOAIProvider],
          openAPI: {
            info: {
              title: 'NodeArch Express Template',
              version: '0.1.0'
            },
            servers: [
              {
                url: 'http://localhost:6000',
                description: 'Local server O'
              }
            ]
          },
          format: OpenAPIFormat.Json,
          path: './public/docs/openapi.json'
        }),
        new SwaggerApp({
          url: '/docs/openapi.json'
        }),
        new JoiApp()
      ],
      logs: {
        prefix: 'MyApp'
      }
    });
  }
} 