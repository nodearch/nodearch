import { Service } from '../../../../components';

@Service()
export class Ext2Service {
  validateUrl(url: string) {
    try {
      new URL(url);

      return true;
    } 
    catch {
      return false;
    }
  }
}