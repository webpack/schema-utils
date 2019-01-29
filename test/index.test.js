/* eslint-disable
  strict,
  no-shadow,
  arrow-body-style
*/

'use strict';

const ajv = require('../src/ajv');
const validateOptions = require('../src');

const testSchema = require('./fixtures/schema.json');
const errorSchema = require('./fixtures/errors/schema.json');

const validOptions = Object.freeze({
  type() {},
  array: ['a'],
  string: 'hello',
  object: {
    prop: false,
    object: {
      prop: false,
    },
  },
  boolean: true,
  instance: new RegExp(''),
});

describe('when schema is object', () => {
  test('should pass, uncached', () => {
    const validateSpy = jest.spyOn(ajv, 'validate');
    expect(validateOptions(testSchema, validOptions, '{Name}')).toBe(true);
    expect(validateSpy).toHaveBeenCalled();
    validateSpy.mockRestore();
  });
  test('should pass, cached', () => {
    const validateSpy = jest.spyOn(ajv, 'validate');
    expect(validateOptions(testSchema, validOptions, '{Name}')).toBe(true);
    expect(validateSpy).not.toHaveBeenCalled();
    validateSpy.mockRestore();
  });
});

describe('when schema is string', () => {
  test('should throw', () => {
    expect(() => {
      return validateOptions(
        'test/fixtured/schema.json',
        validOptions,
        '{Name}'
      );
    }).toThrowError('no schema with key or ref "test/fixtured/schema.json"');
  });
});

describe('Error', () => {
  const options = {
    type: null,
    array: {},
    string: false,
    object: {
      prop: 1,
      object: {
        prop: 1,
      },
    },
    boolean: 'hello',
    instance() {},
  };

  const validate = () => {
    return validateOptions(testSchema, options, '{Name}');
  };

  test('should throw non objects', () => {
    expect(() => {
      return validateOptions(testSchema, undefined, '{Name}');
    }).toThrowError('should be object');
  });

  test('Throws', () => {
    expect(validate).toThrowError();
    expect(validate).toThrowErrorMatchingSnapshot();
  });

  test('Errors', () => {
    try {
      validate();
    } catch (err) {
      const errors = err.errors.map((err) => err.dataPath);

      const expected = [
        '.string',
        '.array',
        '.object.prop',
        '.object.object.prop',
        '.boolean',
        '.type',
        '.instance',
      ];

      expect(errors).toMatchObject(expected);
      expect(err.errors).toMatchSnapshot();
    }
  });

  describe('Messages', () => {
    test('Default', () => {
      const options = {
        type() {},
        array: [''],
        string: 1,
        object: {
          prop: false,
          object: {
            prop: false,
          },
        },
        boolean: true,
        instance: new RegExp(''),
      };

      const validate = () => {
        return validateOptions(testSchema, options, '{Name}');
      };

      try {
        validate();
      } catch (err) {
        err.errors.forEach((err) => expect(err).toMatchSnapshot());

        expect(err.message).toMatchSnapshot();
      }
    });

    test('Customized', () => {
      const options = {
        type() {},
        array: [''],
        string: 1,
        object: {
          prop: false,
          object: {
            prop: false,
          },
        },
        boolean: true,
        instance: new RegExp(''),
      };

      const validate = () => {
        return validateOptions(errorSchema, options, '{Name}');
      };

      try {
        validate();
      } catch (err) {
        err.errors.forEach((err) => expect(err).toMatchSnapshot());

        expect(err.message).toMatchSnapshot();
      }
    });
  });
});
