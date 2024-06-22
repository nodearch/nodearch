import { App } from '@nodearch/core';
import { LambdaApp } from '@nodearch/lambda';
import { MochaApp } from '@nodearch/mocha';



export default class MyLambda extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      extensions: [
        new LambdaApp(),
        new MochaApp()
      ],
      logs: {
        prefix: 'My Lambda'
      }
    });
  }
} 