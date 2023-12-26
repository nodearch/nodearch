#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { getLoadMode } from './dist/utils/load-mode.js';
import axios from 'axios';
import fs from 'node:fs/promises';

const cliColors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const tsConfig = join(__dirname, './tsconfig.json');
const tsNodeBin = join(__dirname, './node_modules/ts-node/dist/bin.js');
const appStart = join(__dirname, './dist/start.js');

const appArgs = process.argv.slice(2);

try {
  const pkg = JSON.parse(await fs.readFile(join(__dirname, './package.json'), 'utf8'));
  const currentCliVersion = pkg.version;
  
  // Get latest CLI version from npm registry
  const { data: latestPkgInfo } = await axios('https://registry.npmjs.org/@nodearch/cli/latest', { timeout: 1000 });
  
  // Check if the latest version is different from the current version
  if (latestPkgInfo.version !== currentCliVersion) {
    print(cliColors.yellow, `CLI Update available ${currentCliVersion} -> ${latestPkgInfo.version}`);
    print(cliColors.yellow, `Run npm i -g @nodearch/cli to update`);
    console.log();
  }
}
catch (err) {}

if (getLoadMode() === 'ts') {
  spawn('node', [tsNodeBin, '-r', 'tsconfig-paths/register', '-P', tsConfig, appStart, ...appArgs], {
    stdio: 'inherit'
  });
}
else if (getLoadMode() === 'js') {
  import(new URL('./dist/start.js', import.meta.url));
}
else {
  console.error(`Unknown value for the option loadMode, valid values are 'ts' or 'js'`);
}

function print(color, message) {
  console.log(`${color}${message}${cliColors.reset}`);
}