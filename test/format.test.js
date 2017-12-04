/* eslint-disable
  comma-dangle,
  arrow-body-style,
  array-bracket-spacing,
*/
import validateOptions from '../src';

const FIXTURES = 'test/fixtures/schemas';

describe('Errors', () => {
  const validate = (schema, options) => () => {
    return validateOptions(
      `${FIXTURES}/${schema}.json`,
      options,
      '{Name}'
    );
  };

  test('Format - typeof', () => {
    const options = {
      fn: {}
    };

    const err = validate('typeof', options);

    expect(err).toThrowError();
    expect(err).toThrowErrorMatchingSnapshot();
  });

  test('Format - instanceof', () => {
    const options = {
      regexp: {}
    };

    const err = validate('instanceof', options);

    expect(err).toThrowError();
    expect(err).toThrowErrorMatchingSnapshot();
  });
});
