export class HttpError extends Error {
  code: number;
  details?: string[];

  constructor(code: number, message: string, details?: string[]) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

/**
 * The server could not understand the request due to invalid syntax.
 * Code: 400
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export class BadRequest extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(400, message || 'Bad Request', details);
  }
}

/** 
 * Although the HTTP standard specifies "unauthorized",
 * semantically this response means "unauthenticated".
 * That is, the client must authenticate itself to get the requested response.
 * Code: 401
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 */
export class Unauthorized extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(401, message || 'Unauthorized', details);
  }
}

/**
 * The client does not have access rights to the content;
 * that is, it is unauthorized, so the server is refusing to give the requested resource.
 * Unlike 401, the client's identity is known to the server.
 * Code: 403
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
 */
export class Forbidden extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(403, message || 'Forbidden', details);
  }
}

/**
 * The server can not find requested resource.
 * In the browser, this means the URL is not recognized.
 * In an API, this can also mean that the endpoint is valid
 * but the resource itself does not exist.
 * Servers may also send this response instead of 403
 * to hide the existence of a resource from an unauthorized client.
 * This response code is probably the most famous one due to its frequent occurrence on the web.
 * Code: 404
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 */
export class NotFound extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(404, message || 'Not Found', details);
  }
}

/**
 * The request method is known by the server but has been disabled and cannot be used.
 * For example, an API may forbid DELETE-ing a resource.
 * The two mandatory methods, GET and HEAD,
 * must never be disabled and should not return this error code.
 * Code: 405
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
 */
export class MethodNotAllowed extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(405, message || 'Method Not Allowed', details);
  }
}

/**
 * This response is sent when the web server,
 * after performing server-driven content negotiation,
 * doesn't find any content that conforms to the criteria given by the user agent.
 * Code: 406
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
 */
export class NotAcceptable extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(406, message || 'Not Acceptable', details);
  }
}

/**
 * This response is sent on an idle connection by some servers,
 * even without any previous request by the client.
 * It means that the server would like to shut down this unused connection.
 * This response is used much more since some browsers,
 * like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing.
 * Also note that some servers merely shut down the connection without sending this message.
 * Code: 408
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408
 */
export class RequestTimeout extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(408, message || 'Request Timeout', details);
  }
}

/**
 * The server has encountered a situation it doesn't know how to handle.
 * Code: 500
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
 */
export class InternalServerError extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(500, message || 'Internal Server Error', details);
  }
}

/**
 * The request method is not supported by the server and cannot be handled.
 * The only methods that servers are required to support
 * (and therefore that must not return this code) are GET and HEAD.
 * Code: 501
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
 */
export class NotImplemented extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(501, message || 'Not Implemented', details);
  }
}

/**
 * This error response means that the server,
 * while working as a gateway to get a response needed to handle the request,
 * got an invalid response.
 * Code: 502
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502
 */
export class BadGateway extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(502, message || 'Bad Gateway', details);
  }
}

/**
 * The server is not ready to handle the request.
 * Common causes are a server that is down for maintenance or that is overloaded.
 * Note that together with this response,
 * a user-friendly page explaining the problem should be sent.
 * This responses should be used for temporary conditions and the Retry-After: HTTP header should,
 * if possible, contain the estimated time before the recovery of the service.
 * The webmaster must also take care about the caching-related headers that are sent along with this response,
 * as these temporary condition responses should usually not be cached.
 * Code: 503
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
 */
export class ServiceUnavailable extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(503, message || 'Service Unavailable', details);
  }
}

/**
 * This error response is given when the server is acting as a gateway and cannot get a response in time.
 * Code: 504
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504
 */
export class GatewayTimeout extends HttpError {
  constructor(message?: string, details?: string[]) {
    super(504, message || 'Gateway Timeout', details);
  }
}
