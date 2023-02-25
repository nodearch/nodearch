import * as url from 'node:url';


export abstract class Paths {
  static get filename() {
    return url.fileURLToPath(import.meta.url);
  }

  static get dirname() {
    return url.fileURLToPath(new URL('.', import.meta.url));
  }
}
