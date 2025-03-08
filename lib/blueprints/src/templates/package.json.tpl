{
  "name": "{{packageName}}",
  "version": "0.1.0",
  "description": "{{packageDescription}}",
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "start": "nodearch start --loadMode=js",
    "dev": "nodearch start",
    "dev:watch": "nodearch start -w",
    "build": "nodearch build",
    {{#if extensions.mocha}}
    "test": "nodearch test",
    {{/if}}
    {{#if extensions.express}}
    "openapi": "nodearch openapi",
    {{/if}}
  },
  "keywords": [],
  "author": "",
  "license": "",
  "dependencies": {
    "@nodearch/core": "^2.2.2",
    "@nodearch/command": "^1.1.2",
    "@nodearch/cli": "^2.2.5",
    {{#if extensions.express}}
    "@nodearch/express": "^2.1.2",
    "@nodearch/openapi": "^1.1.2",
    "@nodearch/swagger": "^1.1.2",
    "@nodearch/joi": "^1.1.2",
    "@nodearch/joi-express": "^1.1.2",
    "express": "^4.21.2",
    "joi": "^17.13.3",
    "swagger-ui-dist": "^5.18.2",
    {{/if}}
    {{#if extensions.mocha}}
    "@nodearch/mocha": "^1.1.2",
    "mocha": "^11.1.0",
    {{/if}}
  },
  "devDependencies": {
    "reflect-metadata": "^0.2.2",
    "@types/node": "^22.10.10",
    "typescript": "^5.7.3",
    {{#if extensions.express}}
    "@types/express": "^5.0.0",
    "joi-to-swagger": "^6.2.0",
    "@types/swagger-ui-dist": "^3.30.5",
    {{/if}}
    {{#if extensions.mocha}}
    "@types/mocha": "^10.0.10",
    "@types/chai": "^5.0.1",
    "chai": "^5.1.2",
    {{/if}}
  }
}
