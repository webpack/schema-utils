/* eslint-disable
  strict,
  no-shadow,
  arrow-body-style
*/

'use strict';

const validateOptions = require('../src');

test('Valid', () => {
  const options = {
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
  };
  const validate = () => {
    return validateOptions('test/fixtures/schema.json', options, '{Name}');
  };

  expect(validate()).toBe(true);
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
    return validateOptions('test/fixtures/schema.json', options, '{Name}');
  };

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
        return validateOptions('test/fixtures/schema.json', options, '{Name}');
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
        added: 'test',
      };

      const validate = () => {
        return validateOptions(
          'test/fixtures/errors/schema.json',
          options,
          '{Name}'
        );
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
