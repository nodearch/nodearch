import { Hook, HookContext, IHook } from '@nodearch/core';
import { MochaAnnotation, TestMode } from '../enums';
import { MochaService } from './mocha.service';


@Hook({
  export: true
})
export class MochaHook implements IHook {
  
  constructor(private mochaService: MochaService) {}

  async onInit(context: HookContext) {
    const container = context.getContainer();
    const testComponents = context.getComponents(MochaAnnotation.Test);
    const mockComponents = context.getComponents(MochaAnnotation.Mock);

    if (testComponents) {
      this.mochaService.init(container, testComponents, mockComponents);
    }

  }

  async onStart(context: HookContext) {
    await this.mochaService.run([TestMode.UNIT], 
      {
        _: [ 'node' ],
        cwd: 'D:\\dev\\nodearch\\templates\\standalone',
        // cwd: process.cwd(),
        all: true,
        a: true,
        checkCoverage: false,

        extension: [ '.ts' ],
        e: [ '.ts' ],
        include: [ 'src/**/**.ts' ],
        n: [ 'src/**/**.ts' ],

        // exclude: [ 'node_modules', 'src/**/**.spec.js' ],
        // x: [ 'node_modules', 'src/**/**.spec.js' ],
        reporter: [ 'lcov', 'text' ],
        r: [ 'lcov', 'text' ],
        reportDir: './coverage',
        skipFull: false,
        tempDir: './.nyc_output',
        t: './.nyc_output',
        nycrcPath: undefined,
        excludeNodeModules: true,
        ignoreClassMethods: [],
        autoWrap: true,
        esModules: true,
        parserPlugins: [
          'asyncGenerators',
          'bigInt',
          'classProperties',
          'classPrivateProperties',
          'classPrivateMethods',
          'dynamicImport',
          'importMeta',
          'numericSeparator',
          'objectRestSpread',
          'optionalCatchBinding',
          'topLevelAwait'
        ],
        compact: true,
        preserveComments: true,
        produceSourceMap: true,
        sourceMap: true,
        require: [],
        i: [],
        instrument: true,
        excludeAfterRemap: true,
        branches: 0,
        functions: 0,
        lines: 90,
        statements: 0,
        perFile: false,
        showProcessTree: false,
        skipEmpty: false,
        silent: false,
        s: false,
        eager: false,
        cache: true,
        c: true,
        cacheDir: undefined,
        babelCache: false,
        useSpawnWrap: false,
        hookRequire: true,
        hookRunInContext: false,
        hookRunInThisContext: false,
        clean: true,
        inPlace: false,
        exitOnError: false,
        delete: false,
        completeCopy: false,
        instrumenter: './lib/instrumenters/istanbul'
      });
  }
}