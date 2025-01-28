import fs from 'node:fs/promises';
import Handlebars from 'handlebars';

const templateDirUrl = new URL('./templates/', import.meta.url);

export async function generate(templateName: string, data: Record<string, any>, location: URL) {
  const templateContent = await getTemplate(templateName);

  const template = Handlebars.compile(templateContent);

  const renderedCode = template(data);

  console.log(renderedCode);

  // await writeFile(location, renderedCode);
}

async function getTemplate(templateName: string) {
  return await fs.readFile(new URL(templateName, templateDirUrl), 'utf-8');
}

async function writeFile(fileUrl: URL, content: string) {
  await fs.writeFile(fileUrl, content);
}

Handlebars.registerHelper('strArrayPrint', function (strArr) {
  return strArr.join(', ');
});