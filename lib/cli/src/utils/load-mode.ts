import { AppLoadMode } from '@nodearch/core/fs';


export function getLoadMode() {
  /**
   * In case Yargs is not loaded yet, so we need to parse the arguments manually
   * But we're still including this argument in the yargs config in commands/start/start.command.ts
   * For validation.
   */
  let loadMode = AppLoadMode.TS;

  const flagIndex = process.argv.findIndex(x => x.startsWith('--loadMode'));

  if (flagIndex === -1) return loadMode;

  const flagKey = process.argv[flagIndex];

  const flagHasValue = flagKey.includes('=');

  if (flagHasValue) {
    loadMode = flagKey.split('=')[1] as AppLoadMode;
  }
  else {
    const value = process.argv[flagIndex + 1];
    if (value && !value.startsWith('-')) {
      loadMode = value as AppLoadMode;
    }
  }
  
  return loadMode;
}