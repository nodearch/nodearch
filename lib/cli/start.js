#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { getLoadMode } from './dist/utils/load-mode.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const tsConfig = join(__dirname, './tsconfig.json');
const tsNodeBin = join(__dirname, './node_modules/ts-node/dist/bin.js');
const appStart = join(__dirname, './dist/start.js');
const appArgs = process.argv.slice(2);

if (getLoadMode() === 'ts') {
  spawn('node', [tsNodeBin, '-P', tsConfig, appStart, ...appArgs], {
    stdio: 'inherit'
  });
}
else if (getLoadMode() === 'js') {
  import(new URL('./dist/start.js', import.meta.url));
}
else {
  console.error(`Unknown value for the option loadMode, valid values are 'ts' or 'js'`);
}