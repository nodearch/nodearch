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

export enum ExpressDecorator {
  HTTP_METHOD = '@nodearch/express/decorators/http-method',
  HTTP_PARAM = '@nodearch/express/decorators/http-param',
  MIDDLEWARE = '@nodearch/express/decorators/middleware',
  USE = '@nodearch/express/decorators/use',
}