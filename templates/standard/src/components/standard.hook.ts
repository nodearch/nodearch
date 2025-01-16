import { Hook, IHook } from '@nodearch/core';
import { MappingService } from '@nodearch/jsonata';
import { UserMapper } from './user.mapper.js';

@Hook()
export class StandardHook implements IHook {

  constructor(private readonly mapping: MappingService) {}

  async onStart() {

    const user = this.mapping.transform({ 
      data: { 
        user: { key: '1' },
        client: { key: '2' }
      } 
    }, UserMapper);

    console.log('Standard Hook', user);

  }
} 