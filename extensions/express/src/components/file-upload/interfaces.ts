import multer from 'multer';


export interface IFileUploadInfo {
  name: string;
  maxCount?: number;
}

export interface IUploadInfo {
  files?: string[] | IFileUploadInfo[];

  /** by default it allow files */
  allowFiles?: boolean;

  /** Options for initializing a Upload instance. */
  options?: multer.Options
}