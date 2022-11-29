export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  HEAD = 'head',
  PATCH = 'patch',
  OPTIONS = 'options',
}

export enum RouteHandlerParam {
  BODY = 'body',
  QUERY = 'query',
  HEADERS = 'headers',
  PARAMS = 'params',
  REQ = 'req',
  RES = 'res'
}

export enum ExpressAnnotationId {
  HttpMethod = '@nodearch/express/annotations/http-method',
  HttpParam = '@nodearch/express/annotations/http-param',
  Middleware = '@nodearch/express/annotations/middleware',
  UseMiddleware = '@nodearch/express/annotations/use-middleware',
  Validation = '@nodearch/express/annotations/validation',
  OpenAPI = '@nodearch/express/annotations/openapi',
  FileUpload = '@nodearch/express/annotations/upload',
  HttpController = '@nodearch/express/annotations/http-controller'
}