import Handlebars from 'handlebars';
import { getTemplate, writeFile } from './fs';
import prettier from 'prettier';

export async function generate(templateName: string, data: Record<string, any>, location: string) {
  const templateContent = await getTemplate(templateName);

  const template = Handlebars.compile(templateContent);

  let renderedCode = template(data);

  // Format the code using prettier only for TypeScript files
  if (location.endsWith('.ts')) {
    try {
      renderedCode = await prettier.format(renderedCode, {
        parser: 'typescript',
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 100,
        tabWidth: 2
      });
    } catch (error) {
      console.warn('Failed to format TypeScript code with prettier:', error);
      // Continue with unformatted code if prettier fails
    }
  }
  else if (location.endsWith('.json')) {
    try {
      renderedCode = await prettier.format(renderedCode, {
        parser: 'json',
        singleQuote: true,
        trailingComma: 'none',
        printWidth: 100,
        tabWidth: 2
      });
    } catch (error) {
      console.warn('Failed to format JSON code with prettier:', error);
      // Continue with unformatted code if prettier fails
    }
  }

  await writeFile(location, renderedCode);

  return location;
}
