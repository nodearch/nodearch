import { IComponentOverride, IMock, Mock } from '@nodearch/core';
import { UserService } from '../user.service';

@Mock()
export class UserCtrlMock implements IMock {
  override: IComponentOverride[] = [
    {
      component: UserService,
      use: { ee: 5656565 }
    }
  ];
}