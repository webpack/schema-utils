/* eslint-disable */
import validateOptions from '../dist/validateOptions';

test('Valid', () => {
  const options = {
    string: 'hello',
    array: [ 'a' ],
    object: { prop: false },
    boolean: true
  };

  expect(validateOptions('test/fixtures/schema.json', options, 'Loader'))
    .toBe(true);
});

test('Error', () => {
  const options = {
    string: false,
    array: {},
    object: { prop: 1 },
    boolean: 'hello'
  };

  expect(() => validateOptions('test/fixtures/schema.json', options, '{Name}'))
    .toThrowError(/{Name} Options Validation Error/);
});
