#!/usr/bin/env node

const cliColors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

checkNodeVersion();

import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { getLoadMode } from './dist/utils/load-mode.js';
import axios from 'axios';
import fs from 'node:fs/promises';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
// const tsConfig = join(__dirname, './tsconfig.json');
// const tsNodeBin = (fileURLToPath(import.meta.resolve('ts-node'))).replace('index', 'bin');
const appStart = join(__dirname, './dist/start.js');

const appArgs = process.argv.slice(2);

const pkg = JSON.parse(await fs.readFile(join(__dirname, './package.json'), 'utf8'));
const currentCliVersion = pkg.version;

process.env.NODEARCH_CLI_VERSION = currentCliVersion;

try {
  // Get latest CLI version from npm registry
  const { data: latestPkgInfo } = await axios('https://registry.npmjs.org/@nodearch/cli/latest', { timeout: 1000 });

  // Check if the latest version is different from the current version
  if (latestPkgInfo.version !== currentCliVersion) {
    print(cliColors.yellow, `CLI Update available ${currentCliVersion} -> ${latestPkgInfo.version}`);
    print(cliColors.yellow, `Run npm i -g @nodearch/cli to update`);
    console.log();
  }
}
catch (err) { }

if (getLoadMode() === 'ts') {
  spawn('node', ['--no-warnings=ExperimentalWarning', '--experimental-specifier-resolution=node', '--loader', 'ts-node/esm', appStart, ...appArgs], {
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

function checkNodeVersion() {
  const currentVersion = process.versions.node;
  const targetVersion = "20.10.0";
  let isTargetVersion = false; 

  const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number);
  const [targetMajor, targetMinor, targetPatch] = targetVersion.split('.').map(Number);

  if (currentMajor > targetMajor ||
    (currentMajor === targetMajor && currentMinor > targetMinor) ||
    (currentMajor === targetMajor && currentMinor === targetMinor && currentPatch >= targetPatch)) {
    isTargetVersion = true;
  } else {
    isTargetVersion = false;
  }

  if (!isTargetVersion) {
    print(cliColors.red, `[NodeArch] Node version must be at least ${targetVersion}`);
    process.exit(1);
  }
}