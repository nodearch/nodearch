import { describe, it } from 'mocha';
import { expect } from 'chai';
import { merge, set, get, handleObjectPath, capitalize } from './utils';
import { ClassInfo } from './class-info';

describe('utils/utils', () => {

  describe('merge', () => {

    it('add keys in target that do not exist at the root', () => {
      const src = { key1: 'value1', key2: 'value2' };
      const target = {};

      const res = merge(target, src);

      expect(target).to.deep.equals({}, 'merge should be immutable');
      expect(res).to.deep.equals(src);
    });

    it('merge existing simple keys in target at the roots', () => {
      const src = { key1: 'changed', key2: 'value2' };
      const target = { key1: 'value1', key3: 'value3' };

      const expected = {
        key1: 'changed',
        key2: 'value2',
        key3: 'value3'
      };

      expect(merge(target, src)).to.deep.equals(expected);
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

      expect(merge(target, src)).to.deep.equals(expected);
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

      expect(merge(target, src)).to.deep.equals(expected);
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

      expect(merge(target, src)).to.deep.equals(expected);
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

      expect(merged).to.deep.equals(expected);
      expect(merged.a).to.not.equals(target.a);
      expect(merged.b).to.not.equals(src.b);
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

      expect(target).to.deep.equals({
        key1: {
          subKey1: 'subValue1',
          subKey2: 'subValue2'
        },
        key2: 'value2'
      });

      expect(merge(target, src)).to.deep.equals(expected);
    });

    it('should replace objects with arrays', () => {
      const target = { key1: { subKey: 'one' } };
      const src = { key1: ['subKey'] };
      const expected = { key1: ['subKey'] };

      expect(merge(target, src)).to.deep.equals(expected);
    });

    it('should replace arrays with objects', () => {
      const target = { key1: ['subKey'] };
      const src = { key1: { subKey: 'one' } };
      const expected = { key1: { subKey: 'one' } };

      expect(merge(target, src)).to.deep.equals(expected);
    });

    it('should replace dates with arrays', () => {
      const target = { key1: new Date() };
      const src = { key1: ['subKey'] };
      const expected = { key1: ['subKey'] };

      expect(merge(target, src)).to.deep.equals(expected);
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

      expect(merge(target, src)).to.deep.equals(expected);
    });

    it('should work on simple array', () => {
      const src = ['one', 'three'];
      const target = ['one', 'two'];
      const expected = ['one', 'two', 'one', 'three'];

      expect(merge(target, src)).to.deep.equals(expected);
      expect(Array.isArray(merge(target, src))).to.be.true;
    });

    it('should work on another simple array', () => {
      const target = ['a1', 'a2', 'c1', 'f1', 'p1'];
      const src = ['t1', 's1', 'c2', 'r1', 'p2', 'p3'];
      const expected = ['a1', 'a2', 'c1', 'f1', 'p1', 't1', 's1', 'c2', 'r1', 'p2', 'p3'];

      expect(target).to.deep.equals(['a1', 'a2', 'c1', 'f1', 'p1']);
      expect(merge(target, src)).to.deep.equals(expected);
      expect(Array.isArray(merge(target, src))).to.be.true;
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

      expect(res).to.deep.equals(expected);
      expect(Array.isArray(res.key1)).to.be.true;
      expect(Array.isArray(res.key2)).to.be.true;
    });

    it('should work on array properties', () => {
      const src = {
        key1: ['one', 'three'],
        key2: ['four']
      };

      const target = {
        key1: ['one', 'two']
      };

      expect(target).to.deep.equals({
        key1: ['one', 'two']
      });

      const merged: any = merge(target, src);

      expect(merged.key1).to.not.equals(src.key1);
      expect(merged.key1).to.not.equals(target.key1);
      expect(merged.key2).to.not.equals(src.key2);
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
      expect(merged).to.deep.equals(expected);
      expect(Array.isArray(merge(target, src))).to.be.true;
      expect(Array.isArray((<any>merge(target, src))[0].key1)).to.be.true;
      expect(merged[0].key1).to.not.equals(src[0].key1);
      expect(merged[0].key1).to.not.equals(target[0].key1);
      expect(merged[0].key2).to.not.equals(src[0].key2);
      expect(merged[1].key3).to.not.equals(src[1].key3);
      expect(merged[1].key3).to.not.equals(target[1].key3);
    });

    it('should treat regular expressions like primitive values', () => {
      const target = { key1: /abc/ };
      const src = { key1: /efg/ };
      const expected = { key1: /efg/ };

      expect(merge(target, src)).to.deep.equals(expected);
    });

    it('should treat regular expressions like primitive values and should not clone', () => {
      const target = { key1: /abc/ };
      const src = { key1: /efg/ };

      const output: any = merge(target, src);
      expect(output.key1).to.equals(src.key1);
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

      expect(actual).to.deep.equals(expected);
      expect(actual.key.valueOf()).to.equals(tuesday.valueOf());
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

      expect(actual.key).to.equals(tuesday);
    });

    it('should work on array with null in it', () => {
      const target: any[] = [];

      const src = [null];

      const expected = [null];

      expect(merge(target, src)).to.deep.equals(expected);
    });

    it('should clone array\'s element if it is object', () => {
      const a = { key: 'yup' };
      const target: any[] = [];
      const source = [a];

      const output: any = merge(target, source);

      expect(output[0]).to.not.equal(a);
      expect(output[0].key).to.equals('yup');
    });

    it('should clone an array property when there is no target array', () => {
      const someObject = {};
      const target = {};
      const source = { ary: [someObject] };
      const output: any = merge(target, source);

      expect(output).to.deep.equals({ ary: [{}] });
      expect(output.ary[0]).to.not.equals(someObject);
    });

    it('should overwrite values when property is initialized but undefined', () => {
      const target1 = { value: [] };
      const target2 = { value: null };
      const target3 = { value: 2 };

      const src = { value: undefined };

      function hasUndefinedProperty(o: any) {
        expect(o.hasOwnProperty('value')).to.be.true;
        expect(o.value).to.be.undefined;
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

      expect(actual).to.deep.equals(expected);
    });

  });

  describe('handleObjectPath', () => {
    it('should reject in case the provided path is not array of strings or a dotted string path', () => {
      expect(() => handleObjectPath({})).throw('path should be either dotted string or array of strings');
    });

    it('should handle array of strings as a path', () => {
      const result = handleObjectPath(['one', 'two', 'three', 'four', 'five']);
      expect(result).to.deep.equal(['one', 'two', 'three', 'four', 'five']);
    });

    it('should handle dotted string path', () => {
      const result = handleObjectPath('one.two.three.four.five');
      expect(result).to.deep.equal(['one', 'two', 'three', 'four', 'five']);
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

      expect(result).to.deep.equal({
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

      expect(result).to.deep.equal({
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

      expect(result).to.deep.equal({
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

      expect(() => set(dataObj, {}, {})).throw('path should be either dotted string or array of strings');
    });

    it('should handle an array as a value', () => {

      const obj = {
        hh: 'dd',
        one: {
          two: {}
        }
      };

      const result = set(obj, 'one.two.three', ['item1', 'item2']);

      expect(result).to.deep.equal({
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

      expect(result).to.deep.equal({
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
      expect(obj).to.deep.equal({
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
      expect(obj).to.deep.equal({
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
      expect(result).to.equal('5');
    });

    it('should get nested object from object by path', () => {
      const result = get(data, 'one.two.three.four');
      expect(result).to.deep.equal({ five: '5' });
    });

    it('should get by array of strings instead of string dotted', () => {
      const result = get(data, ['one', 'two', 'three', 'four']);
      expect(result).to.deep.equal({ five: '5' });
    });

    it('should return null in case of not exist path', () => {
      const result = get(data, 'one.two.no');
      expect(result).to.be.null;
    });

  });

  describe('capitalize', () => {
    it('should get string started with capital letter', () => {
      const result = capitalize('test');
      expect(result).to.be.equal('Test');
    });

    it('should get string started with capital letter & keep dashes, underscore or spaces', () => {
      const result1 = capitalize('test-1');
      const result2 = capitalize('test_1');
      const result3 = capitalize('test 1 ok');

      expect(result1).to.be.equal('Test-1');
      expect(result2).to.be.equal('Test_1');
      expect(result3).to.be.equal('Test 1 ok');
    });

    it('should keep capitalized word as it is', () => {
      const result = capitalize('Test-1');
      expect(result).to.be.equal('Test-1');
    });

    it('should keep words started with non alphabetical value as it is', () => {
      const result1 = capitalize('_test');
      const result2 = capitalize(' test');
      const result3 = capitalize('5test');

      expect(result1).to.be.equal('_test');
      expect(result2).to.be.equal(' test');
      expect(result3).to.be.equal('5test');
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
      expect(res).to.deep.equals(['getType']);
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
      expect(res).to.deep.equals(['getAge']);

    });

    it('should return empty array if empty object was provided', () => {
      expect(ClassInfo.getMethods(<any> {})).to.deep.equal([]);
    });

  });

});
