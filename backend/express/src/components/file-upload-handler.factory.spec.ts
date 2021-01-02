import 'ts-jest';
import { ControllerMetadata } from '../metadata';
import { ExpressService } from './express.service';
import { FileUploadHandlerFactory } from './file-upload-handler.factory';

describe('components/file-upload-handler.factory', () => {
  describe('FileUploadHandlerFactory.getFileUploadInfo', () => {

    it('Should get uploaded files info for controller', () => {
      class TestController {}
      const uploadedFilesInfo = [{ method: 'test', uploadInfo: {} }]

      const fileUploadHandlerFactory = new FileUploadHandlerFactory(<any> {}, <any> {});

      const getUploadInfoSpy = spyOn(ControllerMetadata, 'getUploadInfo').and.returnValue(uploadedFilesInfo);

      const fileUploadMetadataInfo = fileUploadHandlerFactory.getFileUploadInfo(TestController);

      expect(fileUploadMetadataInfo).toEqual(uploadedFilesInfo);
      expect(getUploadInfoSpy).toHaveBeenCalledTimes(1);
    });

  });


});