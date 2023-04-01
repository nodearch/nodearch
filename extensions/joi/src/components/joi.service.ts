import { Service } from '@nodearch/core';

@Service({ export: true })
export class JoiService {
  constructor() {
    console.log('JoiService');
  }
}