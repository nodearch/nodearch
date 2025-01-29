import Handlebars from 'handlebars';
import { getTemplate } from './fs.js';
import './helpers.js';


export async function generate(templateName: string, data: Record<string, any>, location: URL) {
  const templateContent = await getTemplate(templateName);

  const template = Handlebars.compile(templateContent);

  const renderedCode = template(data);

  console.log(`Generate ${templateName} at ${location}`);
  console.log(renderedCode);

  // await writeFile(location, renderedCode);
}
