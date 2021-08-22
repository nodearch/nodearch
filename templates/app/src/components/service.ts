import { InjectNs, Service } from '@nodearch/core';


@Service()
export class WorkerService {
  private tasks: any;

  constructor(@InjectNs('zeebe-tasks') tasks: any) {
    this.tasks = tasks;
  }

  start() {
    console.log('worker tasks', this.tasks);
  }
}