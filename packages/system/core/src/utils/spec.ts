import { merge, set, get, handleObjectPath, capitalize } from './utils';
import { ClassInfo } from './class-info';
import { ClassDecoratorFactory } from './decorator';

describe('utils/utils', () => {

  describe('merge', () => {

    it('add keys in target that do not exist at the root', () => {
      const src = { key1: 'value1', key2: 'value2' };
      const target = {};

      const res = merge(target, src);

      expect(target).toEqual({});
      expect(res).toEqual(src);
    });

    it('merge existing simple keys in target at the roots', () => {
      const src = { key1: 'changed', key2: 'value2' };
      const target = { key1: 'value1', key3: 'value3' };

      const expected = {
        key1: 'changed',
        key2: 'value2',
        key3: 'value3'
      };

      expect(merge(target, src)).toEqual(expected);
    });

    it('merge nested objects into target', () => {
      const src = {
        key1: {
          subKey1: 'changed',
          subKey3: 'added'
        }
      };

      const target = {
        key1: {
          subKey1: 'value1',
          subKey2: 'value2'
        }
      };

      const expected = {
        key1: {
          subKey1: 'changed',
          subKey2: 'value2',
          subKey3: 'added'
        }
      };

      expect(merge(target, src)).toEqual(expected);
    });

    it('replace simple key with nested object in target', () => {
      const src = {
        key1: {
          subKey1: 'subValue1',
          subKey2: 'subValue2'
        }
      };

      const target = {
        key1: 'value1',
        key2: 'value2'
      };

      const expected = {
        key1: {
          subKey1: 'subValue1',
          subKey2: 'subValue2'
        },
        key2: 'value2'
      };

      expect(merge(target, src)).toEqual(expected);
    });

    it('should add nested object in target', () => {
      const src = {
        b: {
          c: {}
        }
      };

      const target = {
        a: {}
      };

      const expected = {
        a: {},
        b: {
          c: {}
        }
      };

      expect(merge(target, src)).toEqual(expected);
    });

    it('should clone source and target', () => {
      const src = {
        b: {
          c: 'foo'
        }
      };

      const target = {
        a: {
          d: 'bar'
        }
      };

      const expected = {
        a: {
          d: 'bar'
        },
        b: {
          c: 'foo'
        }
      };

      const merged: any = merge(target, src);

      expect(merged).toEqual(expected);
      expect(merged.a).not.toBe(target.a);
      expect(merged.b).not.toBe(src.b);
    });

    it('should replace object with simple key in target', () => {
      const src = { key1: 'value1' };

      const target = {
        key1: {
          subKey1: 'subValue1',
          subKey2: 'subValue2'
        },
        key2: 'value2'
      };

      const expected = { key1: 'value1', key2: 'value2' };

      expect(target).toEqual({
        key1: {
          subKey1: 'subValue1',
          subKey2: 'subValue2'
        },
        key2: 'value2'
      });

      expect(merge(target, src)).toEqual(expected);
    });

    it('should replace objects with arrays', () => {
      const target = { key1: { subKey: 'one' } };
      const src = { key1: ['subKey'] };
      const expected = { key1: ['subKey'] };

      expect(merge(target, src)).toEqual(expected);
    });

    it('should replace arrays with objects', () => {
      const target = { key1: ['subKey'] };
      const src = { key1: { subKey: 'one' } };
      const expected = { key1: { subKey: 'one' } };

      expect(merge(target, src)).toEqual(expected);
    });

    it('should replace dates with arrays', () => {
      const target = { key1: new Date() };
      const src = { key1: ['subKey'] };
      const expected = { key1: ['subKey'] };

      expect(merge(target, src)).toEqual(expected);
    });

    it('should replace null with arrays', () => {
      const target = {
        key1: null
      };

      const src = {
        key1: ['subKey']
      };

      const expected = {
        key1: ['subKey']
      };

      expect(merge(target, src)).toEqual(expected);
    });

    it('should work on simple array', () => {
      const src = ['one', 'three'];
      const target = ['one', 'two'];
      const expected = ['one', 'two', 'one', 'three'];

      expect(merge(target, src)).toEqual(expected);
      expect(Array.isArray(merge(target, src))).toEqual(true);
    });

    it('should work on another simple array', () => {
      const target = ['a1', 'a2', 'c1', 'f1', 'p1'];
      const src = ['t1', 's1', 'c2', 'r1', 'p2', 'p3'];
      const expected = ['a1', 'a2', 'c1', 'f1', 'p1', 't1', 's1', 'c2', 'r1', 'p2', 'p3'];

      expect(target).toEqual(['a1', 'a2', 'c1', 'f1', 'p1']);
      expect(merge(target, src)).toEqual(expected);
      expect(Array.isArray(merge(target, src))).toEqual(true);
    });

    it('should work on array properties', () => {
      const src: any = {
        key1: ['one', 'three'],
        key2: ['four']
      };

      const target: any = {
        key1: ['one', 'two']
      };

      const expected: any = {
        key1: ['one', 'two', 'one', 'three'],
        key2: ['four']
      };

      const res: any = merge(target, src);

      expect(res).toEqual(expected);
      expect(Array.isArray(res.key1)).toEqual(true);
      expect(Array.isArray(res.key2)).toEqual(true);
    });

    it('should work on array properties', () => {
      const src = {
        key1: ['one', 'three'],
        key2: ['four']
      };

      const target = {
        key1: ['one', 'two']
      };

      expect(target).toEqual({
        key1: ['one', 'two']
      });

      const merged: any = merge(target, src);

      expect(merged.key1).not.toBe(src.key1);
      expect(merged.key1).not.toBe(target.key1);
      expect(merged.key2).not.toBe(src.key2);
    });

    it('should work on array of objects', () => {
      const src = [
        { key1: ['one', 'three'], key2: ['one'] },
        { key3: ['five'] }
      ];

      const target = [
        { key1: ['one', 'two'] },
        { key3: ['four'] }
      ];

      const expected = [
        { key1: ['one', 'two'] },
        { key3: ['four'] },
        { key1: ['one', 'three'], key2: ['one'] },
        { key3: ['five'] }
      ];

      const merged: any = merge(target, src);
      expect(merged).toEqual(expected);
      expect(Array.isArray(merge(target, src))).toEqual(true);
      expect(Array.isArray((<any>merge(target, src))[0].key1)).toEqual(true);
      expect(merged[0].key1).not.toBe(src[0].key1);
      expect(merged[0].key1).not.toBe(target[0].key1);
      expect(merged[0].key2).not.toBe(src[0].key2);
      expect(merged[1].key3).not.toBe(src[1].key3);
      expect(merged[1].key3).not.toBe(target[1].key3);
    });

    it('should treat regular expressions like primitive values', () => {
      const target = { key1: /abc/ };
      const src = { key1: /efg/ };
      const expected = { key1: /efg/ };

      expect(merge(target, src)).toEqual(expected);
    });

    it('should treat regular expressions like primitive values and should not clone', () => {
      const target = { key1: /abc/ };
      const src = { key1: /efg/ };

      const output: any = merge(target, src);
      expect(output.key1).toEqual(src.key1);
    });

    it('should treat dates like primitives', () => {
      const monday = new Date('2016-09-27T01:08:12.761Z');
      const tuesday = new Date('2016-09-28T01:18:12.761Z');

      const target = {
        key: monday
      };

      const source = {
        key: tuesday
      };

      const expected = {
        key: tuesday
      };

      const actual: any = merge(target, source);

      expect(actual).toEqual(expected);
      expect(actual.key.valueOf()).toEqual(tuesday.valueOf());
    });

    it('should treat dates like primitives and should not clone', () => {
      const monday = new Date('2016-09-27T01:08:12.761Z');
      const tuesday = new Date('2016-09-28T01:18:12.761Z');

      const target = {
        key: monday
      };

      const source = {
        key: tuesday
      };

      const actual: any = merge(target, source);

      expect(actual.key).toEqual(tuesday);
    });

    it('should work on array with null in it', () => {
      const target: any[] = [];

      const src = [null];

      const expected = [null];

      expect(merge(target, src)).toEqual(expected);
    });

    it('should clone array\'s element if it is object', () => {
      const a = { key: 'yup' };
      const target: any[] = [];
      const source = [a];

      const output: any = merge(target, source);

      expect(output[0]).not.toBe(a);
      expect(output[0].key).toEqual('yup');
    });

    it('should clone an array property when there is no target array', () => {
      const someObject = {};
      const target = {};
      const source = { ary: [someObject] };
      const output: any = merge(target, source);

      expect(output).toEqual({ ary: [{}] });
      expect(output.ary[0]).not.toBe(someObject);
    });

    it('should overwrite values when property is initialized but undefined', () => {
      const target1 = { value: [] };
      const target2 = { value: null };
      const target3 = { value: 2 };

      const src = { value: undefined };

      function hasUndefinedProperty(o: any) {
        expect(o.hasOwnProperty('value')).toEqual(true);
        expect(o.value).toEqual(undefined);
      }

      hasUndefinedProperty(merge(target1, src));
      hasUndefinedProperty(merge(target2, src));
      hasUndefinedProperty(merge(target3, src));
    });

    it('dates should copy correctly in an array', () => {
      const monday = new Date('2016-09-27T01:08:12.761Z');
      const tuesday = new Date('2016-09-28T01:18:12.761Z');

      const target = [monday, 'dude'];
      const source = [tuesday, 'lol'];

      const expected = [monday, 'dude', tuesday, 'lol'];
      const actual = merge(target, source);

      expect(actual).toEqual(expected);
    });

  });

  describe('handleObjectPath', () => {
    it('should reject in case the provided path is not array of strings or a dotted string path', () => {
      expect(() => handleObjectPath({})).toThrow('path should be either dotted string or array of strings');
    });

    it('should handle array of strings as a path', () => {
      const result = handleObjectPath(['one', 'two', 'three', 'four', 'five']);
      expect(result).toEqual(['one', 'two', 'three', 'four', 'five']);
    });

    it('should handle dotted string path', () => {
      const result = handleObjectPath('one.two.three.four.five');
      expect(result).toEqual(['one', 'two', 'three', 'four', 'five']);
    });
  });

  describe('set', () => {
    it('should set the provided object on the source object using the path', () => {
      const dataObj = {
        test: 'test1',
        one: {
          h: 'h1',
          two: {
            h: 'h2'
          }
        }
      };

      const result = set(dataObj, 'one.two.three.four.five', { nestedTesting: 'ntest' });

      expect(result).toEqual({
        test: 'test1',
        one: {
          h: 'h1',
          two: {
            h: 'h2',
            three: {
              four: {
                five: {
                  nestedTesting: 'ntest'
                }
              }
            }
          }
        }
      });
    });

    it('should accept array of strings as a path', () => {
      const dataObj = {
        test: 'test1',
        one: {
          h: 'h1',
          two: {
            h: 'h2'
          }
        }
      };

      const result = set(dataObj, ['one', 'two', 'three', 'four', 'five'], { nestedTesting: 'ntest' });

      expect(result).toEqual({
        test: 'test1',
        one: {
          h: 'h1',
          two: {
            h: 'h2',
            three: {
              four: {
                five: {
                  nestedTesting: 'ntest'
                }
              }
            }
          }
        }
      });
    });

    it('should set all the attributes in the given object on the source object and keep existing attributes', () => {
      const dataObj = {
        test: 'test1',
        one: {
          h: 'h1',
          two: {
            h: 'h2'
          },
          tt: { h: 'h-' }
        }
      };

      const result = set(dataObj, 'one.two', { nestedTesting: 'ntest' });

      expect(result).toEqual({
        test: 'test1',
        one: {
          h: 'h1',
          two: {
            h: 'h2',
            nestedTesting: 'ntest'
          },
          tt: { h: 'h-' }
        }
      });
    });

    it('should reject in case the provided path is not array of strings or a dotted string path', () => {
      const dataObj = {
        test: 'test1'
      };

      expect(() => set(dataObj, {}, {})).toThrow('path should be either dotted string or array of strings');
    });

    it('should handle an array as a value', () => {

      const obj = {
        hh: 'dd',
        one: {
          two: {}
        }
      };

      const result = set(obj, 'one.two.three', ['item1', 'item2']);

      expect(result).toEqual({
        hh: 'dd',
        one: {
          two: {
            three: ['item1', 'item2']
          }
        }
      });
    });

    it('should set array items to existing array', () => {

      const obj = {
        hh: 'dd',
        one: {
          two: {
            three: ['item1', 'item2']
          }
        }
      };

      const result = set(obj, 'one.two.three', ['item3', 'item4']);

      expect(result).toEqual({
        hh: 'dd',
        one: {
          two: {
            three: ['item1', 'item2', 'item3', 'item4']
          }
        }
      });
    });

    it('should handle string as a value to existing source attribute', () => {
      const obj = {
        hh: 'hh1',
        one: {
          two: ''
        }
      };

      set(obj, 'one.two', 'test1');
      expect(obj).toEqual({
        hh: 'hh1',
        one: {
          two: 'test1'
        }
      });
    });

    it('should handle string as a value to non-existing source attribute', () => {
      const obj = {
        hh: 'hh1',
        one: {
        }
      };

      set(obj, 'one.two', 'test1');
      expect(obj).toEqual({
        hh: 'hh1',
        one: {
          two: 'test1'
        }
      });
    });
  });

  describe('get', () => {

    const data = {
      one: {
        hh: 'hh',
        two: {
          three: {
            four: {
              five: '5'
            }
          }
        }
      }
    };

    it('should get value from object by path', () => {
      const result = get(data, 'one.two.three.four.five');
      expect(result).toEqual('5');
    });

    it('should get nested object from object by path', () => {
      const result = get(data, 'one.two.three.four');
      expect(result).toEqual({ five: '5' });
    });

    it('should get by array of strings instead of string dotted', () => {
      const result = get(data, ['one', 'two', 'three', 'four']);
      expect(result).toEqual({ five: '5' });
    });

    it('should return null in case of not exist path', () => {
      const result = get(data, 'one.two.no');
      expect(result).toEqual(null);
    });

  });

  describe('capitalize', () => {
    it('should get string started with capital letter', () => {
      const result = capitalize('test');
      expect(result).toEqual('Test');
    });

    it('should get string started with capital letter & keep dashes, underscore or spaces', () => {
      const result1 = capitalize('test-1');
      const result2 = capitalize('test_1');
      const result3 = capitalize('test 1 ok');

      expect(result1).toEqual('Test-1');
      expect(result2).toEqual('Test_1');
      expect(result3).toEqual('Test 1 ok');
    });

    it('should keep capitalized word as it is', () => {
      const result = capitalize('Test-1');
      expect(result).toEqual('Test-1');
    });

    it('should keep words started with non alphabetical value as it is', () => {
      const result1 = capitalize('_test');
      const result2 = capitalize(' test');
      const result3 = capitalize('5test');

      expect(result1).toEqual('_test');
      expect(result2).toEqual(' test');
      expect(result3).toEqual('5test');
    });
  });
});

describe('utils/proto', () => {

  describe('ClassInfo.getMethods', () => {

    class Person {

      private firstName: string;
      private lastName: string;
      constructor(first: string, last: string) {
        this.firstName = first;
        this.lastName = last;
      }

      public get name(): string {
        return `${this.firstName} ${this.lastName}`;
      }

      public set name(name: string) {

        const names = name.split(' ');
        this.firstName = names[0] || '';
        this.lastName = names.length > 1 ? names[1] : '';
      }

      public getType(): string {
        return 'Person';
      }
    }

    it('get methods from Class have have prototype function getters and setters', () => {
      const res = ClassInfo.getMethods(Person);
      expect(res).toEqual(['getType']);
    });

    it('get methods from inherited class without touch parent class methods', () => {

      class Student extends Person {

        private age: number;
        constructor(first: string, last: string, age: number) {
          super(first, last);
          this.age = age;
        }

        public getAge(): number {
          return this.age;
        }
      }

      const res = ClassInfo.getMethods(Student);
      expect(res).toEqual(['getAge']);

    });

    it('should return empty array if empty object was provided', () => {
      expect(ClassInfo.getMethods(<any> {})).toEqual([]);
    });

  });

});

describe('utils/decorator', () => {

  describe('ClassDecoratorFactory.requiredParams', () => {


    it('Should Create Decorator with Required Params', () => {  
      interface InputData {
        name: string;
        age: number
      }
  
      const fakeDecoratorHandlers = { handler: (target: Function, options: InputData) => {} };
      const handlerSpy = spyOn(fakeDecoratorHandlers, 'handler');
  
      const RequiredParamsDecorator = ClassDecoratorFactory.requiredParams(fakeDecoratorHandlers.handler);
      @RequiredParamsDecorator({ name: 'test', age: 123 })
      class TestClass {}
  
      expect(handlerSpy).toBeCalledTimes(1);
      expect(handlerSpy).toBeCalledWith(TestClass, {'age': 123, 'name': 'test'});
    });

  });

  describe('ClassDecoratorFactory.noParams', () => {


    it('Should Create Decorator with No Params', () => {  
  
      const fakeDecoratorHandlers = { handler: () => {} };
      const handlerSpy = spyOn(fakeDecoratorHandlers, 'handler');
  
      const RequiredParamsDecorator = ClassDecoratorFactory.noParams(fakeDecoratorHandlers.handler);
      @RequiredParamsDecorator
      class TestClass {}
  
      expect(handlerSpy).toBeCalledTimes(1);
      expect(handlerSpy).toBeCalledWith(TestClass);
    });

  });

  describe('ClassDecoratorFactory.optionalParams', () => {
    interface InputData {
      name: string;
      age: number
    }


    it('Should Create Decorator with No Params', () => {  
  
      const fakeDecoratorHandlers = { handler: (target: Function, options?: InputData) => {} };
      const handlerSpy = spyOn(fakeDecoratorHandlers, 'handler');
  
      const RequiredParamsDecorator = ClassDecoratorFactory.optionalParams(fakeDecoratorHandlers.handler);
      @RequiredParamsDecorator
      class TestClass {}
  
      expect(handlerSpy).toBeCalledTimes(1);
      expect(handlerSpy).toBeCalledWith(TestClass);
    });

    it('Should Create Decorator with Params', () => {  
  
      const fakeDecoratorHandlers = { handler: (target: Function, options?: InputData) => {} };
      const handlerSpy = spyOn(fakeDecoratorHandlers, 'handler');
  
      const RequiredParamsDecorator = ClassDecoratorFactory.optionalParams(fakeDecoratorHandlers.handler);
      @RequiredParamsDecorator({ age: 1, name: 'test' })
      class TestClass {}
  
      expect(handlerSpy).toBeCalledTimes(1);
      expect(handlerSpy).toBeCalledWith(TestClass, {'age': 1, 'name': 'test'});
    });

  });

});
