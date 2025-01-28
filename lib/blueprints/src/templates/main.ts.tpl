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
        new {{this}}(){{#unless @last}},{{/unless}}
        {{/each}}
      ],
      {{/if}}
      logs: {
        prefix: '{{className}}'
      }
    });
  }
}
