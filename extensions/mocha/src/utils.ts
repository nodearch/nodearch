export function camelToTitle(camelCase: string) {
  return camelCase
    .replace(/([A-Z])/g, (match) => ` ${match.toLowerCase()}`)
    .trim()
    .replace(/^./, (match) => match.toUpperCase());
}