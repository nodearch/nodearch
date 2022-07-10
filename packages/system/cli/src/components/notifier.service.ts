import { Service } from '@nodearch/core';
import notifier from 'node-notifier';
import path from 'path';


@Service()
export class NotifierService { 

  private isEnabled = true;

  notify(message: string) {
    if (this.isEnabled) {
      notifier.notify({
        title: 'NodeArch',
        message,
        sound: true,
        icon: path.join(__dirname, '..', '..', 'assets', 'notifier.png'),
        timeout: 5
      });

    }
  }

  get enabled() {
    return this.isEnabled
  }

  set enabled(isEnabled: boolean) {
    this.isEnabled = isEnabled;
  }
}