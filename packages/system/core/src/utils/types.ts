export type GeneralConstructor = { new(...args: any): any };

export type ClassConstructor<TReturn = any> = { new(...args: any): TReturn };