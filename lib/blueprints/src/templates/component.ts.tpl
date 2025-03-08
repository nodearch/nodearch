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
export class {{className}}{{#if interfaces}} implements {{strArrayPrint interfaces}}{{/if}} {
  {{#if methods}}
  {{#each methods}}

  {{#if this.decorators}}
  {{#each this.decorators}}
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
  {{/if}}
  {{#if this.async}}async {{/if}}{{this.name}}({{#each this.parameters}}{{#if this.decorators}}{{#each this.decorators}}{{#unless this.options}}@{{this.name}}() {{/unless}}{{#if this.options}}@{{this.name}}({
    {{#each this.options}}
    {{this.key}}: {{dataTypeFormat this.value}}{{#unless @last}},{{/unless}}
    {{/each}}
  }) {{/if}}{{/each}}{{/if}}{{this.name}}: {{this.type}}{{#unless @last}}, {{/unless}}{{/each}}){{#if this.returnType}}: {{{this.returnType}}}{{/if}} {
    {{#if this.body}}
    {{this.body}}
    {{/if}}
  }
  {{/each}}
  {{/if}}
}