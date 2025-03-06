import { register } from 'fork-child';
import { AppLoader, AppLoadMode } from '@nodearch/core/fs';
import { ComponentInfo } from '@nodearch/core/components';

register([
  getCommands
]);

async function loadApp(appDirUrl: URL) {
  const appLoader = new AppLoader({ 
    cwd: appDirUrl, 
    loadMode: AppLoadMode.TS, 
    initMode: 'init'
  });

  await appLoader.load();

  if (!appLoader.app) {
    throw new Error('App not loaded');
  }

  return appLoader.app;


}

async function getCommands(appDirUrl: URL) {
  const app = await loadApp(appDirUrl);

  const commands = app.getComponentRegistry().get({ 
    id: '@nodearch/command/decorators/command', 
  });

  const res = commands.map((command: ComponentInfo) => {
    const commandInstance = command.getInstance();
  
    return {
      command: commandInstance.command,
      description: commandInstance.describe
    };
  });

  return res;
}

