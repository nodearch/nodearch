export abstract class MetadataInfo {

  static readonly PREFIX = 'nodearch.io/';

  static getClassMetadata(key: string, target: any) {
    return Reflect.getMetadata(MetadataInfo.PREFIX + key, target);
  }

  static getMethodMetadata(key: string, target: any, propertyKey: string | symbol) {
    return Reflect.getMetadata(MetadataInfo.PREFIX + key, target, propertyKey);
  }

  static setClassMetadata(key: string, target: any, value: any) {
    Reflect.defineMetadata(MetadataInfo.PREFIX + key, value, target);
  }

  static setMethodMetadata(key: string, target: any, propertyKey: string | symbol, value: any) {
    Reflect.defineMetadata(MetadataInfo.PREFIX + key, value, target, propertyKey);
  }

  static getClassParams(target: any): any[] {
    return Reflect.getMetadata('design:paramtypes', target) || [];
  }

  static getMethodParams(target: any, propertyKey: string | symbol): any[] {
    return Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
  }
}
