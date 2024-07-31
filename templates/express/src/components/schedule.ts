import { ScheduledJob } from '@nodearch/pulsecron';

@ScheduledJob('OneOne')
export class ScheduleService {
  constructor() {
    console.log('Schedule');
  }

  async run(job: any) {
    console.log('Schedule handler', job);
  }
}