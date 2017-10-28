/* eslint-disable
  comma-dangle,
  arrow-body-style,
  array-bracket-spacing,
*/
import validateOptions from '../src';

test('Valid', () => {
  const options = {
    string: 'hello',
    array: [ 'a' ],
    object: { prop: false },
    boolean: true,
    type() {},
    instance: new RegExp('')
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
    instance() {}
  };

  const validate = () => {
    return validateOptions('test/fixtures/schema.json', options, '{Name}');
  };

  test('should throw error', () => {
    expect(validate).toThrowError(/Validation Error\n\n{Name} Invalid Options\n\n/);
  });

  test('should have errors for every key in options', () => {
    try {
      validate();
    } catch (error) {
      const errors = error.err.map(e => e.dataPath);

      const expected = ['.string', '.array', '.object.prop', '.boolean', '.type', '.instance'];

      expect(errors).toMatchObject(expected);
      expect(error.err).toMatchSnapshot();
    }
  });
});
