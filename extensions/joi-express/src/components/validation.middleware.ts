import Joi from 'joi';
import { Middleware, IMiddleware, BadRequest } from '@nodearch/express';
import { IJoiSchemaKeys, JoiSchema } from '../interfaces.js';
import { JoiExpressConfig } from './joi-express.config.js';


@Middleware({ export: true })
export class ValidationMiddleware implements IMiddleware<JoiSchema> {
  
  constructor(
    private readonly config: JoiExpressConfig
  ) {}

  async handler(data: { args: any, options: JoiSchema }) {

    const objectToValidate = {
      body: data.args.req.body,
      params: data.args.req.params,
      query: data.args.req.query,
      headers: data.args.req.headers,
    };

    try {
      const result = Joi.attempt(objectToValidate, data.options, this.config.joiOptions);

      data.args.req.body = result.body;
      data.args.req.params = result.params;
      data.args.req.query = result.query;
      data.args.req.headers = result.headers;
    }
    catch(err: any) {
      throw new BadRequest(err.message, err.details);
    }
  }
}