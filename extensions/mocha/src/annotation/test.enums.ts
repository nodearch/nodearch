export enum TestMode {
  UNIT = 'unit',
  E2E = 'e2e'
}

export enum MochaAnnotation {
  Test = '@nodearch/mocha/annotation/test',
  Mock = '@nodearch/mocha/annotation/mock',
  Override = '@nodearch/mocha/annotation/override',
  BeforeAll = '@nodearch/mocha/annotation/before-all',
  AfterAll = '@nodearch/mocha/annotation/after-all',
  BeforeEach = '@nodearch/mocha/annotation/before-each',
  AfterEach = '@nodearch/mocha/annotation/after-each',
  Case = '@nodearch/mocha/annotation/case'
}