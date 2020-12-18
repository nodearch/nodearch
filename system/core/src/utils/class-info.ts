export abstract class ClassInfo {
  static getMethods(target: Function): string[] {
    const proto = target.prototype;
    if (!proto) return [];

    const propertyNames = Object.getOwnPropertyNames(proto) || [];

    return propertyNames
      .filter((propertyName: string) => {
        const propertyDescriptor: any = Object.getOwnPropertyDescriptor(proto, propertyName);

        if (propertyDescriptor.set || propertyDescriptor.get) {
          return false;
        }

        return typeof proto[propertyName] === 'function' && propertyName !== 'constructor';
      });
  }
}