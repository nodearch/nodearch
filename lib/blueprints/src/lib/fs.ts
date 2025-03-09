import path from 'node:path';
import fs from 'node:fs/promises';

const templateDirUrl = path.join(__dirname, '../../templates/');

export async function getTemplate(templateName: string) {
  const filePath = path.join(templateDirUrl, templateName);
  return await fs.readFile(filePath, 'utf-8');
}

export async function writeFile(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(filePath, content);
}