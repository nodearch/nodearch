{{#each imports}}
import { {{strArrayPrint this.imported}} } from '{{this.moduleName}}';
{{/each}}

export class {{className}} extends App {
  constructor() {
    super({
      components: {
        url: new URL('components', import.meta.url)
      },
      {{#if extensions.length}}
      extensions: [
      	{{#each extensions}}
        {{#unless this.options}}
        new {{this.name}}(){{#unless @last}},{{/unless}}
        {{/unless}}
        {{#if this.options}}
        new {{this.name}}({
          {{#each this.options}}
          {{this.key}}: {{dataTypeFormat this.value}}{{#unless @last}},{{/unless}}
          {{/each}}
        }){{#unless @last}},{{/unless}}
        {{/if}}
        {{/each}}
      ],
      {{/if}}
      logs: {
        prefix: '{{className}}'
      }
    });
  }
}
