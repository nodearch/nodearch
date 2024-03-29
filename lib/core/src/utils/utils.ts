export function isSpecial(value: any) {
  const stringValue = Object.prototype.toString.call(value);
  return stringValue === '[object RegExp]' || stringValue === '[object Date]';
}

export function isNonNullObject(value: any) {
  return !!value && typeof value === 'object';
}

export function mergeObject(target: any, source: any) {
  const destination: any = {};
  if (isMergeableObject(target)) {
    Object.keys(target).forEach(function(key) {
      destination[key] = clone(target[key]);
    });
  }

  Object.keys(source).forEach(function(key) {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = clone(source[key]);
    }
    else {
      destination[key] = merge(target[key], source[key]);
    }
  });

  return destination;
}

export function isMergeableObject(value: any) {
  return isNonNullObject(value) && !isSpecial(value);
}

export function emptyTarget(val: any) {
  return Array.isArray(val) ? [] : {};
}

export function arrayMerge(target: any, source: any) {
  return target.concat(source).map(function(element: any) {
    return clone(element);
  });
}

export function clone(value: any) {
  return isMergeableObject(value) ? merge(emptyTarget(value), value) : value;
}

export function merge(target: object, source: object): any {
  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return clone(source);
  }
  else if (sourceIsArray) {
    return arrayMerge(target, source);
  }
  else {
    return mergeObject(target, source);
  }
}

export function isObject(value: any) {
  return value !== null && typeof value === 'object';
}

export function handleObjectPath(objPath: any) {
  let pathParts;

  if (typeof objPath === 'string') {
    pathParts = objPath.split('.');
  }
  else if (objPath && objPath.length) {
    pathParts = objPath;
  }
  else {
    throw new Error('path should be either dotted string or array of strings');
  }

  return pathParts;
}

export function assignValue(objRef: any, key: string, value: any) {
  if (Array.isArray(objRef[key]) && Array.isArray(value)) {
    objRef[key].push(...value);
  }
  else if (isObject(objRef[key]) && isObject(value)) {
    // Object.assign(objRef[key], value);
    deepMerge(objRef[key], value);
  }
  else {
    objRef[key] = value;
  }
}

export function deepMerge(target: any, source: any): any {
  // Iterate over all properties in the source object
  for (const key of Object.keys(source)) {
    // If the property is an object, recursively merge it
    if (isObject(target[key]) && isObject(source[key])) {
      deepMerge(target[key], source[key]);
    }
    // If the property is an array, concatenate it
    else if (Array.isArray(target[key]) && Array.isArray(source[key])) {
      target[key] = target[key].concat(source[key]);
    }
    // Otherwise, assign the value from the source object to the target object
    else {
      target[key] = source[key];
    }
  }

  return target;
}

export function set(obj: any, dottedPath: any, value: any): any {
  const pathParts = handleObjectPath(dottedPath);
  const lastPathPart = pathParts[pathParts.length - 1];

  let objRef = obj;

  // loop over path parts except the last part to ensure the path is exist
  for (let i = 0; i < pathParts.length - 1; i++) {
    const pathPart = pathParts[i];

    // if path doesn't exist create it
    if (!objRef[pathPart]) {
      objRef[pathPart] = {};
    }

    // change the reference to the nested object
    objRef = objRef[pathPart];
  }

  assignValue(objRef, lastPathPart, value);

  return obj;
}

export function get(obj: any, dottedPath: any) {
  const pathParts = handleObjectPath(dottedPath);

  let nested = obj;

  for (let i = 0; i < pathParts.length; i++) {
    if (!nested[pathParts[i]]) {
      return null;
    }

    nested = nested[pathParts[i]];
  }

  return nested;
}

export function capitalize(txt: string) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

export function lowerCase(txt: string) {
  return txt.charAt(0).toLowerCase() + txt.slice(1);
}

export function camelToTitle(camelCase: string) {
  return camelCase
    .replace(/([A-Z]+)/g, (match) => ` ${match}`)
    .trim()
    .replace(/^./, (match) => match.toUpperCase());
}

export function toCamelCase (str: string, separator: string | RegExp): string {
  return lowerCase(str.split(separator).map(capitalize).join(''));
}

export function getAllIndexes(str: string, searchElement: string) {
  const indexes = [];

  for (let index = 0; index < str.length; index++) {
    if (str[index] === searchElement) {
      indexes.push(index);
    }
  }

  return indexes;
}