export {};

declare global {
  namespace Express {
    export interface  Request {
      nodearch: {
        controller: any;
        responseTime?: number;
      };
    }
  }
}