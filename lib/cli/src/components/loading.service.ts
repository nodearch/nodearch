import { Service } from '@nodearch/core';
import ora, { Color, Ora, Spinner } from 'ora';

 
@Service()
export class Loading {
  private spinner: Ora;

  constructor() {
    this.spinner = ora();
    this.spinner.spinner = 'bouncingBall';
    this.spinner.color = 'green';
  } 

  start(text: string, options?: { color?: Color; spinner?: Spinner }) {
    this.spinner.text = text + '\n';
    
    if (options?.color)
      this.spinner.color = options.color;
    
    if (options?.spinner)
      this.spinner.spinner = options.spinner;


    this.spinner.start();
  }

  stop() {
    this.spinner.stop();
  }
} 