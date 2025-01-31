{{#each imports}}
import { {{strArrayPrint this.imported}} } from '{{this.moduleName}}';
{{/each}}

{{#each classDecorators}}
{{#unless this.options}}
@{{this.name}}()
{{/unless}}
{{#if this.options}}
@{{this.name}}({
  {{#each this.options}}
  {{this.key}}: {{dataTypeFormat this.value}}{{#unless @last}},{{/unless}}
  {{/each}}
})
{{/if}}
{{/each}}
export class {{className}} {

}