import { Context } from 'aws-lambda';
import LambdaApp from './main.js';
import { AppLoadMode, AppLoader } from '@nodearch/core/fs';
import { LambdaService } from '@nodearch/lambda';

export const handler = async (event: any, context: Context) => {
  const appLoader = new AppLoader({ cwd: new URL('..', import.meta.url), loadMode: AppLoadMode.JS, initMode: 'start' });
  await appLoader.load();

  if (!appLoader.app) {
    throw new Error('App not loaded');
  }

  const app = appLoader.app as LambdaApp;

  const lambdaService = app.getContainer().get(LambdaService);

  if (!lambdaService) {
    throw new Error('Lambda service not found');
  }

  return await lambdaService.invoke(context.functionName, event);
};

const res = await handler("1", { functionName: 'getUsers' } as Context);
console.log(res);