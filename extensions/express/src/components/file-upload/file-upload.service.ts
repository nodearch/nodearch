import {Service} from "@nodearch/core";
import {ExpressMiddlewareHandler} from "../middleware/interfaces";
import {IUploadInfo} from "./interfaces";
import {ExpressConfig} from "../express/express.config";

@Service()
export class FileUploadService {

  constructor(
    private readonly expressConfig: ExpressConfig
  ) {}

  createMiddleware(uploadInfo: IUploadInfo): ExpressMiddlewareHandler {
    return (req, res, next) => {

      const multerOptions = { ...this.expressConfig.fileUpload, ...uploadInfo.options };

    }
  }
}