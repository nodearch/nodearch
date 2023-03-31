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
  Use = '@nodearch/express/annotations/use',
}