import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const templateDirUrl = new URL('../templates/', import.meta.url);

export async function getTemplate(templateName: string) {
  return await fs.readFile(new URL(templateName, templateDirUrl), 'utf-8');
}

export async function writeFile(fileUrl: URL, content: string) {
  const dir = path.dirname(fileURLToPath(fileUrl));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(fileUrl, content);
}