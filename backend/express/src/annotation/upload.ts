import { IFileUploadInfo, IUploadInfo } from '../interfaces';
import { ControllerMetadata } from '../metadata';

/**
 * Method Decorator to parse form-data to json in req.body
 * all files will be exits in req.body.files
 * any file allowed by default
 */
 export function Upload(files: IFileUploadInfo): MethodDecorator;
 export function Upload(files: IFileUploadInfo[]): MethodDecorator;
 export function Upload(files: string): MethodDecorator;
 export function Upload(files: string[]): MethodDecorator;
 export function Upload(options?: IUploadInfo): MethodDecorator;
 export function Upload(options?: any): MethodDecorator {
   return function (target: Object, propKey: string | symbol) {
     let uploadInfo: IUploadInfo = { allowFiles: true };
 
     if(options) {
       if (Array.isArray(options) && options.length) {
         uploadInfo.files = typeof options[0] === 'string' ? 
           options.map(fileName => ({ name: fileName, maxCount: 1 })) : options;
       }
       else if ((<IFileUploadInfo> options).name) {
         uploadInfo.files = [options];
       }
       else if (typeof options === 'string') {
         uploadInfo.files = [{ name: options, maxCount: 1 }];
       }
       else {
         uploadInfo = { ...uploadInfo, ...options };
 
         if (uploadInfo.files?.length && typeof uploadInfo.files[0] === 'string') {
           uploadInfo.files = (<string[]> uploadInfo.files).map(fileName => ({ name: fileName }));
         }
       }
     }
 
     ControllerMetadata.setUploadInfo(target.constructor, {
       uploadInfo,
       method: <string>propKey
     });
   };
 }