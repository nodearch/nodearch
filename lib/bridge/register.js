import { pathToFileURL } from 'node:url';
import { register } from 'node:module';

register('@swc-node/register/esm', pathToFileURL('./'));