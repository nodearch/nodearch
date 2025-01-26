import { register } from 'node:module';
import { AppLoader, AppLoadMode } from '@nodearch/core/fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const swcNodePath = fileURLToPath(import.meta.resolve('@swc-node/register'));
const swcNodeRegisterPath = path.join(path.dirname(swcNodePath), 'esm', 'esm.mjs');

register(pathToFileURL(swcNodeRegisterPath), pathToFileURL('./'));

await (new AppLoader({ loadMode: AppLoadMode.TS, cwd: pathToFileURL(process.cwd()), initMode: 'start' })).load();