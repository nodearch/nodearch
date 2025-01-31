{
  "name": "{{packageName}}",
  "version": "0.1.0",
  "description": "{{packageDescription}}",
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    {{#each scripts}}
    "{{this.name}}": "{{this.command}}"{{#unless @last}},{{/unless}}
    {{/each}}
  },
  "keywords": [],
  "author": "",
  "license": "",
  {{#if devDependencies.length}}
  "devDependencies": {
    {{#each devDependencies}}
    "{{this.name}}": "{{this.version}}"{{#unless @last}},{{/unless}}
    {{/each}}
  },
  {{else}}
  "devDependencies": {},
  {{/if}}
  {{#if dependencies.length}}
  "dependencies": {
    {{#each dependencies}}
    "{{this.name}}": "{{this.version}}"{{#unless @last}},{{/unless}}
    {{/each}}
  }
  {{else}}
  "dependencies": {}
  {{/if}}
}
