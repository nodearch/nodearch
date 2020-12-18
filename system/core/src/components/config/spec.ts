import { describe, it } from 'mocha';
import { expect } from 'chai';
import { TypeParser } from './type-parser';

describe('application/config/type-parser', () => {

  describe('TypeParser', () => {
    it('parse number using defaultValue', () => {
      const result = TypeParser.parse('55555', 111);
      expect(typeof result).equals('number');
    });

    it('parse string using defaultValue', () => {
      const result = TypeParser.parse('55555', '111');
      expect(typeof result).equals('string');
    });

    it('parse json using defaultValue', () => {
      const result = TypeParser.parse('{ "one": 1, "two": "2" }', { one: 1 });
      expect(typeof result).equals('object');
    });

    it('if no dataType or defaultValue then fallback to string', () => {
      const result = TypeParser.parse('55555');
      expect(typeof result).equals('string');
    });
  });

});
