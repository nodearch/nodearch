import { Service } from '@nodearch/core';
import { IExpressInfo } from './interfaces';


@Service()
export class ExpressService {

  constructor() {}

  init(expressInfo: IExpressInfo) {
    console.log(expressInfo);
  }

}