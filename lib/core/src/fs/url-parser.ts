import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export class UrlParser {

  // Return the directory path of the given url
  static dirname(url: URL) {
    return pathToFileURL(path.dirname(fileURLToPath(url)));
  }

  static resolve(base: URL, ...paths: string[]) {
    return pathToFileURL(path.resolve(fileURLToPath(base), ...paths));
  }

  // static resolveUrl(strPath: URL, to?: URL) {
  //   return path.normalize(
  //     path.resolve(to ? fileURLToPath(to) : process.cwd(), fileURLToPath(strPath))
  //   );
  // }

  static join(base: URL, ...paths: string[]) {
    return pathToFileURL(path.join(fileURLToPath(base), ...paths));
  }
} 