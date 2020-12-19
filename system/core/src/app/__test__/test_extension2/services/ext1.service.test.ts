import { Service } from '../../../../components';

@Service()
export class Ext2Service {
  validateUrl(url: string) {
    return true;
  }
}