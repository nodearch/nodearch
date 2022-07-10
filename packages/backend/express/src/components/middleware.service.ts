import { Service, DependencyException } from '@nodearch/core';
import { ControllerMetadata } from '../metadata';
import { IMiddlewareMetadataInfo } from '../interfaces';
import { MiddlewareHandler, MiddlewareProvider } from '../types';
import { ValidationHandlerFactory } from './validation-handler.factory';
import { FileUploadHandlerFactory } from './file-upload-handler.factory';
import express from 'express';
import { MiddlewareType } from '../enums';


@Service()
export class MiddlewareService {

  constructor(
    private validationHandlerFactory: ValidationHandlerFactory,
    private fileUploadHandlerFactory: FileUploadHandlerFactory
  ) {}

  getMiddleware(controller: any): IMiddlewareMetadataInfo[] {
    // get third-party and context middleware
    const middlewareSet: IMiddlewareMetadataInfo[] = ControllerMetadata
      .getMiddleware(controller)
      .reverse();

    // get fileUpload Middleware if exist
    const fileUploadMiddlewareSet = this.fileUploadHandlerFactory.getUploadHandlers(controller);

    fileUploadMiddlewareSet.forEach(uploadMiddleware => {
      middlewareSet.push({ id: middlewareSet.length, ...uploadMiddleware });
    });

    const validationMiddlewareSet = this.validationHandlerFactory.getValidationHandlers(controller);

    validationMiddlewareSet.forEach(validationMiddleware => {
      middlewareSet.push({ id: middlewareSet.length, ...validationMiddleware });
    });

    return middlewareSet;
  }

  getMethodMiddleware(middlewareInfo: IMiddlewareMetadataInfo[], methodName: string): IMiddlewareMetadataInfo[] {
    return middlewareInfo
      .filter(
        mInfo =>
          mInfo.method === methodName ||
          !mInfo.method
      );
  }

  getMiddlewareHandler(middlewareInfo: IMiddlewareMetadataInfo[], controllerInstance: any) {
    return async (req: express.Request, res: express.Response) => {
      for(const mInfo of middlewareInfo) {
        if (mInfo.type === MiddlewareType.CONTEXT) {
          const contextHandler = (<MiddlewareProvider<any>>controllerInstance['middleware:' + mInfo.id]);
          
          if (contextHandler && contextHandler.handler) {
            await contextHandler.handler(req, res, mInfo.options);
          }
          else {
            throw new DependencyException('Cannot resolve Middleware Provider!');
          }
        }
        else {
          // TODO: check if an express middleware responded to the request and never called next
          await this.asyncMiddleware(req, res, <MiddlewareHandler>mInfo.middleware);
        }
      }
    };
  }

  async asyncMiddleware(req: express.Request, res: express.Response, middleware: MiddlewareHandler): Promise<void> {
    return new Promise((resolve, reject) => {
      middleware(req, res, (err?: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}