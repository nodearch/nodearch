import multer from 'multer';


export interface IFileUploadInfo {
  name: string;
  maxCount?: number;
}

export interface IUploadInfo {
  files?: string[] | IFileUploadInfo[];

  /** by default, it allows files */
  allowFiles?: boolean;

  /** Options for initializing an Upload instance. */
  options?: multer.Options;
}