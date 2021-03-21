import { ClassConstructor, Service } from '@nodearch/core';
import express from 'express';
import { IFileUploadInfo, IMiddlewareMetadataInfo, IUploadInfo } from '../interfaces';
import { ServerConfig } from './server.config';
import { ControllerMetadata } from '../metadata';
import multer from 'multer';
import { HttpErrorsRegistry } from './errors-registry.service';
import { BadRequest } from '../http-errors';
import { MiddlewareType } from '../enums';


@Service()
export class FileUploadHandlerFactory {

  constructor(private serverConfig: ServerConfig, private httpErrorsRegistry: HttpErrorsRegistry) {}

  getUploadHandlers(controller: ClassConstructor): Omit<IMiddlewareMetadataInfo, 'id'>[] {
    const uploadMiddlewareSet: Omit<IMiddlewareMetadataInfo, 'id'>[] = [];
    
    const controllerUploadInfo = ControllerMetadata.getUploadInfo(controller);
    
    controllerUploadInfo.forEach(uploadInfo => {
      const handler = this.createHandler(uploadInfo.uploadInfo);
      
      uploadMiddlewareSet.push({ 
        type: MiddlewareType.FILE_UPLOAD, 
        middleware: handler, 
        method: uploadInfo.method, 
        metadata: uploadInfo.uploadInfo 
      });
    });

    return uploadMiddlewareSet;
  }

  private createHandler(fileUploadInfo: IUploadInfo) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let upload;
      const multerOptions = { ...this.serverConfig.fileUploadOptions, ...fileUploadInfo.options };

      if (fileUploadInfo.allowFiles) {
        if (fileUploadInfo.files?.length) {
          if (fileUploadInfo.files.length === 1) {
            const { maxCount, name: fileName } = (<IFileUploadInfo> fileUploadInfo.files[0]);
            upload = maxCount && maxCount > 1 ? multer(multerOptions).array(fileName, maxCount) : multer(multerOptions).single(fileName);
          }
          else {
            upload = multer(multerOptions).fields(<IFileUploadInfo[]> fileUploadInfo.files);
          }
        }
        else {
          upload = multer(multerOptions).any();
        }
      }
      else {
        upload = multer(multerOptions).none();
      }

      upload(req, res, (err?: any) => {
        if (err) {
          this.httpErrorsRegistry.handleError(new BadRequest(this.errorMassage(err)), res);
        }
        else {
          this.moveFilesToBody(req);
          next();
        }
      });
    };
  }

  private moveFilesToBody(req: express.Request) {

    if (req.file && req.file.fieldname) {
      req.body[req.file.fieldname] = req.file;
    }
    else if (req.files) {

      if (Array.isArray(req.files)) {

        for (const file of req.files) {
          req.body[file.fieldname] = file;
        }
      }
      else {
        for (const fileName in req.files) {
          req.body[fileName] = req.files[fileName];
        }
      }
    }
  }

  private errorMassage(err: Error) {
    return err instanceof multer.MulterError ? 
      `FileUpload: ${err.message}${err.field ? ` for Field ${err.field}` : ''}` : 'FileUpload: Something went wrong while uploading file';
  }
}