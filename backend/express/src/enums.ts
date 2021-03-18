export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  HEAD = 'head',
  PATCH = 'patch',
  OPTIONS = 'options',
}

export enum HTTPParam {
  BODY = 'body',
  QUERY = 'query',
  HEADERS = 'headers',
  PARAMS = 'params',
  REQ = 'req',
  RES = 'res'
}

export enum MiddlewareType {
  CONTEXT,
  EXPRESS,
  VALIDATION,
  FILE_UPLOAD
}