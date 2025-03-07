import Handlebars from 'handlebars';
import { getTemplate, writeFile } from './fs';
import './helpers';


export async function generate(templateName: string, data: Record<string, any>, location: string) {
  const templateContent = await getTemplate(templateName);

  const template = Handlebars.compile(templateContent);

  const renderedCode = template(data);

  await writeFile(location, renderedCode);

  return location;
}
