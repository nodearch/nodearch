import { Middleware, IMiddlewareProvider } from '@nodearch/express';
import Joi from 'joi';
import express from 'express';


@Middleware({ export: true })
export class ValidationMiddleware implements IMiddlewareProvider {
  async handler(data: { options: Joi.Schema }) {
    // async handler(req: express.Request, res: express.Response, options: Joi.Schema) {
    console.log('Validate middleware X');
  }
}