// export class FileResolver {
//   static resolveUrl(strPath: string, to?: string) {
//     return path.normalize(path.resolve(to || process.cwd(), strPath));
//   }

//   static resolveUrls(paths: Record<string, string>, to?: string) {
//     const resolvedPaths: Record<string, string> = {};
    
//     for (const p in paths) {
//       resolvedPaths[p] = FileLoader.resolvePath(paths[p], to);
//     }

//     return resolvedPaths;
//   }
// } 