import 'ts-jest';
import { BadRequest, Unauthorized, Forbidden, NotFound, MethodNotAllowed, NotAcceptable, RequestTimeout, InternalServerError, BadGateway, NotImplemented, GatewayTimeout, ServiceUnavailable } from './errors';

describe('errors', () => {
  describe('BadRequest', () => {
    it('Should create error with default message and status code 400', () => {
      const error = new BadRequest();

      expect(error.message).toEqual('Bad Request');
      expect(error.code).toEqual(400);
    });

    it('Should create error with custom message and status code 400', () => {
      const error = new BadRequest('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(400);
    });

    it('Should create error with extra data', () => {
      const error = new BadRequest(undefined, { data: 1 });

      expect(error.message).toEqual('Bad Request');
      expect(error.code).toEqual(400);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('Unauthorized', () => {
    it('Should create error with default message and status code 401', () => {
      const error = new Unauthorized();

      expect(error.message).toEqual('Unauthorized');
      expect(error.code).toEqual(401);
    });

    it('Should create error with custom message and status code 401', () => {
      const error = new Unauthorized('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(401);
    });

    it('Should create error with extra data', () => {
      const error = new Unauthorized('Custom Message', { data: 1 });

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(401);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('Forbidden', () => {
    it('Should create error with default message and status code 403', () => {
      const error = new Forbidden();

      expect(error.message).toEqual('Forbidden');
      expect(error.code).toEqual(403);
    });

    it('Should create error with custom message and status code 403', () => {
      const error = new Forbidden('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(403);
    });

    it('Should create error with extra data', () => {
      const error = new Forbidden(undefined, { data: 1 });

      expect(error.message).toEqual('Forbidden');
      expect(error.code).toEqual(403);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('NotFound', () => {
    it('Should create error with default message and status code 404', () => {
      const error = new NotFound();

      expect(error.message).toEqual('Not Found');
      expect(error.code).toEqual(404);
    });

    it('Should create error with custom message and status code 404', () => {
      const error = new NotFound('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(404);
    });

    it('Should create error with extra data', () => {
      const error = new NotFound(undefined, { data: 1 });

      expect(error.message).toEqual('Not Found');
      expect(error.code).toEqual(404);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('MethodNotAllowed', () => {
    it('Should create error with default message and status code 405', () => {
      const error = new MethodNotAllowed();

      expect(error.message).toEqual('Method Not Allowed');
      expect(error.code).toEqual(405);
    });

    it('Should create error with custom message and status code 405', () => {
      const error = new MethodNotAllowed('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(405);
    });

    it('Should create error with extra data', () => {
      const error = new MethodNotAllowed(undefined, { data: 1 });

      expect(error.message).toEqual('Method Not Allowed');
      expect(error.code).toEqual(405);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('NotAcceptable', () => {
    it('Should create error with default message and status code 406', () => {
      const error = new NotAcceptable();

      expect(error.message).toEqual('Not Acceptable');
      expect(error.code).toEqual(406);
    });

    it('Should create error with custom message and status code 406', () => {
      const error = new NotAcceptable('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(406);
    });

    it('Should create error with extra data', () => {
      const error = new NotAcceptable(undefined, { data: 1 });

      expect(error.message).toEqual('Not Acceptable');
      expect(error.code).toEqual(406);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('RequestTimeout', () => {
    it('Should create error with default message and status code 408', () => {
      const error = new RequestTimeout();

      expect(error.message).toEqual('Request Timeout');
      expect(error.code).toEqual(408);
    });

    it('Should create error with custom message and status code 408', () => {
      const error = new RequestTimeout('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(408);
    });

    it('Should create error with extra data', () => {
      const error = new RequestTimeout(undefined, { data: 1 });

      expect(error.message).toEqual('Request Timeout');
      expect(error.code).toEqual(408);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('InternalServerError', () => {
    it('Should create error with default message and status code 500', () => {
      const error = new InternalServerError();

      expect(error.message).toEqual('Internal Server Error');
      expect(error.code).toEqual(500);
    });

    it('Should create error with custom message and status code 500', () => {
      const error = new InternalServerError('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(500);
    });

    it('Should create error with extra data', () => {
      const error = new InternalServerError(undefined, { data: 1 });

      expect(error.message).toEqual('Internal Server Error');
      expect(error.code).toEqual(500);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('NotImplemented', () => {
    it('Should create error with default message and status code 501', () => {
      const error = new NotImplemented();

      expect(error.message).toEqual('Not Implemented');
      expect(error.code).toEqual(501);
    });

    it('Should create error with custom message and status code 501', () => {
      const error = new NotImplemented('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(501);
    });

    it('Should create error with extra data', () => {
      const error = new NotImplemented(undefined, { data: 1 });

      expect(error.message).toEqual('Not Implemented');
      expect(error.code).toEqual(501);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('BadGateway', () => {
    it('Should create error with default message and status code 502', () => {
      const error = new BadGateway();

      expect(error.message).toEqual('Bad Gateway');
      expect(error.code).toEqual(502);
    });

    it('Should create error with custom message and status code 502', () => {
      const error = new BadGateway('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(502);
    });

    it('Should create error with extra data', () => {
      const error = new BadGateway(undefined, { data: 1 });

      expect(error.message).toEqual('Bad Gateway');
      expect(error.code).toEqual(502);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('ServiceUnavailable', () => {
    it('Should create error with default message and status code 503', () => {
      const error = new ServiceUnavailable();

      expect(error.message).toEqual('Service Unavailable');
      expect(error.code).toEqual(503);
    });

    it('Should create error with custom message and status code 503', () => {
      const error = new ServiceUnavailable('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(503);
    });

    it('Should create error with extra data', () => {
      const error = new ServiceUnavailable(undefined, { data: 1 });

      expect(error.message).toEqual('Service Unavailable');
      expect(error.code).toEqual(503);
      expect(error.data).toEqual({ data: 1 });
    });
  });

  describe('GatewayTimeout', () => {
    it('Should create error with default message and status code 504', () => {
      const error = new GatewayTimeout();

      expect(error.message).toEqual('Gateway Timeout');
      expect(error.code).toEqual(504);
    });

    it('Should create error with custom message and status code 504', () => {
      const error = new GatewayTimeout('Custom Message');

      expect(error.message).toEqual('Custom Message');
      expect(error.code).toEqual(504);
    });

    it('Should create error with extra data', () => {
      const error = new GatewayTimeout(undefined, { data: 1 });

      expect(error.message).toEqual('Gateway Timeout');
      expect(error.code).toEqual(504);
      expect(error.data).toEqual({ data: 1 });
    });
  });
});