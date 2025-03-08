import { Controller } from '@nodearch/core';

@Controller()
@HttpPath({
  path: '/one'
})
export class UserController {

  @Get()
  async get(req: Request, res: Response) {
  }
}