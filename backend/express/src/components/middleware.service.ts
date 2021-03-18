import { Service, ClassInfo, DependencyException } from '@nodearch/core';
import { ControllerMetadata } from '../metadata';
import { IMiddlewareInfo, IMiddlewareMetadataInfo } from '../interfaces';
import { ContextMiddlewareHandler, MiddlewareHandler, MiddlewareProvider } from '../types';
import { ValidationHandlerFactory } from './validation-handler.factory';
import { FileUploadHandlerFactory } from './file-upload-handler.factory';
import express from 'express';
import { MiddlewareType } from '../enums';
import { InternalServerError } from '../http-errors';

@Service()
export class MiddlewareService {

  constructor(
    private validationHandlerFactory: ValidationHandlerFactory,
    private fileUploadHandlerFactory: FileUploadHandlerFactory
  ) {}

  getMiddleware(controller: any): IMiddlewareInfo[] {
    // get third-party and context middleware
    const middlewareSet: IMiddlewareInfo[] = ControllerMetadata
      .getMiddleware(controller)
      .map((middlewareMetaInfo: IMiddlewareMetadataInfo, index: number) => {
        const middlewareInfo = { id: index, ...middlewareMetaInfo, type: MiddlewareType.EXPRESS };

        if (ControllerMetadata.isMiddlewareProvider(middlewareInfo.middleware)) {
          middlewareInfo.type = MiddlewareType.CONTEXT;
          // Add this Middleware as dependency to the controller so inversify can resolve it later
          ClassInfo.propertyInject(controller, <ContextMiddlewareHandler>middlewareInfo.middleware, 'middleware:' + middlewareInfo.id);
        }

        return middlewareInfo;
      })
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

  getMethodMiddleware(middlewareInfo: IMiddlewareInfo[], methodName: string): IMiddlewareInfo[] {
    return middlewareInfo
      .filter(
        mInfo =>
          mInfo.method === methodName ||
          !mInfo.method
      );
  }

  getMiddlewareHandler(middlewareInfo: IMiddlewareInfo[], controllerInstance: any) {
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