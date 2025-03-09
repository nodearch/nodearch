import { App } from '@nodearch/core';
{{#if extensions.express}}
import { ExpressApp, ExpressOAIProvider } from '@nodearch/express';
import { JoiApp } from '@nodearch/joi';
import { JoiExpressApp, JoiOpenApiProvider } from '@nodearch/joi-express';
import { OpenAPIApp, OpenAPIFormat } from '@nodearch/openapi';
import { SwaggerApp } from '@nodearch/swagger';
import { getAbsoluteFSPath } from 'swagger-ui-dist';
import Joi from 'joi';
{{/if}}
{{#if extensions.mocha}}
import { MochaApp } from '@nodearch/mocha';
{{/if}}

export class {{className}} extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      {{#unless hideExtensions}}
      extensions: [
        {{#if extensions.express}}
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
              title: '{{title}}',
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
        {{/if}}
        {{#if extensions.mocha}}
        new MochaApp(),
        {{/if}}
      ],
      {{/unless}}
      logs: {
        prefix: '{{logPrefix}}'
      }
    });
  }
}
