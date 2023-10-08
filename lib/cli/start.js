#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const tsNodeBin = join(__dirname, './node_modules/ts-node/dist/bin.js');
const appStart = join(__dirname, './src/start.ts');

const appArgs = process.argv.slice(2);


spawn('node', [tsNodeBin, appStart, ...appArgs], {
  stdio: 'inherit'
});
