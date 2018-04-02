import validate from '../src';

test('Valid', () => {
  const name = 'TestLoader';
  const schema = 'test/fixtures/schema.json';
  const target = {
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
  const result = validate({ name, schema, target });

  expect(result).toBe(true);
});

describe('Error', () => {
  const name = 'TestLoader';
  const schema = 'test/fixtures/schema.json';
  const target = {
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

  const doit = () => validate({ name, schema, target });

  test('should throw error', () => {
    expect(doit).toThrowError();
    expect(doit).toThrowErrorMatchingSnapshot();
  });

  test('should have errors for every option key', () => {
    try {
      doit();
    } catch (err) {
      const errors = err.meta.errors.map((error) => error.dataPath);

      const expected = [
        '.array',
        '.boolean',
        '.instance',
        '.object.object.prop',
        '.object.prop',
        '.string',
        '.type',
      ];

      expect(errors).toMatchObject(expected);
      expect(err.meta.errors).toMatchSnapshot();
    }
  });
});
