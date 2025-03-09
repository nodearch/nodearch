/**
 * Parses a string into various naming formats
 * 
 * @param name The input name string to parse
 * @returns Object containing className (PascalCase) and titleCase versions
 */
export function parseName(name: string) {
  // Handle empty or null input
  if (!name) {
    return {
      className: '',
      titleCase: '',
      kebabCase: ''
    };
  }
  
  // Split the input into words considering various delimiters
  // Handles camelCase, kebab-case, snake_case, and space-separated words
  const words = name
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .trim()
    .split(/\s+/); // Split by one or more spaces
  
  // Process each word to get the formats we need
  const processedWords = words.map(word => {
    const lowerCase = word.toLowerCase();
    return capitalizeFirstLetter(lowerCase);
  });
  
  return {
    className: processedWords.join(''),       // PascalCase for class names
    titleCase: processedWords.join(' '),      // Title Case with spaces
    kebabCase: processedWords.join('-').toLowerCase() // kebab-case
  };
}

/**
 * Capitalizes the first letter of a string
 * @param str The input string
 * @returns The string with the first letter capitalized
 */
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}