import { ComponentFactory } from '@nodearch/core';
import { ExpressAnnotationId } from '../express/enums';
import { IFileUploadInfo, IUploadInfo } from './interfaces';


/**
 * Method Decorator to parse form-data into req.body.
 * All files will exists on req.body.files.
 * Any file allowed by default.
 */
export function Upload(files: IFileUploadInfo): MethodDecorator;
export function Upload(files: IFileUploadInfo[]): MethodDecorator;
export function Upload(files: string): MethodDecorator;
export function Upload(files: string[]): MethodDecorator;
export function Upload(options?: IUploadInfo): MethodDecorator;
export function Upload(options?: any): MethodDecorator {
  return ComponentFactory.methodDecorator({
    id: ExpressAnnotationId.Upload,
    fn() {

      let uploadInfo: IUploadInfo = { allowFiles: true };

      if (options) {
        if (Array.isArray(options) && options.length) {
          uploadInfo.files = typeof options[0] === 'string' ?
            options.map(fileName => ({ name: fileName, maxCount: 1 })) : options;
        }
        else if ((<IFileUploadInfo>options).name) {
          uploadInfo.files = [options];
        }
        else if (typeof options === 'string') {
          uploadInfo.files = [{ name: options, maxCount: 1 }];
        }
        else {
          uploadInfo = { ...uploadInfo, ...options };
  
          if (uploadInfo.files?.length && typeof uploadInfo.files[0] === 'string') {
            uploadInfo.files = (<string[]>uploadInfo.files).map(fileName => ({ name: fileName }));
          }
        }
      }

      return uploadInfo;
    }
  });
}