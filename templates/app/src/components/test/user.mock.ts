import { IComponentOverride, IMock, Mock } from '@nodearch/core';
import { UserService } from '../user.service';

@Mock()
export class UserCtrlMock implements IMock {
  override: IComponentOverride[] = [
    {
      component: UserService,
      use: { ee: 'eeee66666666666666666666' }
    }
  ];
}