import { Hook, IHook, Logger } from '@nodearch/core';

@Hook()
export class UserHook implements IHook {

  constructor(
    private readonly logger: Logger
  ) {}

  async onStart() {
    this.logger.info('UserHook onStart');
  }
}