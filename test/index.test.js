/* eslint-disable */
import validateOptions from '../src';

test('Valid', () => {
  const options = {
    string: 'hello',
    array: [ 'a' ],
    object: { prop: false },
    boolean: true,
    type: function() {},
    instance: new RegExp(''),

  };

  expect(validateOptions('test/fixtures/schema.json', options, 'Loader'))
    .toBe(true);
});

describe('Error', () => {
  const options = {
    string: false,
    array: {},
    object: { prop: 1 },
    boolean: 'hello',
    type: null,
    instance: function() {},
  };

  const validate = () => validateOptions('test/fixtures/schema.json', options, '{Name}')

  test('should throw error', () => {
    expect(validate).toThrowError(/Validation Error\n\n{Name} Invalid Options\n\n/);
  })

  test('should have errors for every key in options', () => {
    try {
      validate()
    } catch(error) {
      const expected = ['.string', '.array', '.object.prop', '.boolean', '.type', '.instance'];
      const errors = error.err.map(e => e.dataPath)

      expect(errors).toMatchObject(expected);
      expect(error.err).toMatchSnapshot();
    }
  })
});
