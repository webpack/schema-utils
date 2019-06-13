import validate from '../src/index';

describe('validateOptions method', () => {
  describe('should not throws errors on', () => {
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

    it('valid schema', () => {
      expect(() =>
        validate('test/fixtures/schema.json', options, '{Name}')
      ).not.toThrow();
    });
  });

  describe('should throws errors on', () => {
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

    it('invalid schema', () => {
      expect.assertions(3);

      try {
        validate('test/fixtures/schema.json', options, '{Name}');
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowErrorMatchingSnapshot();

        const nestedErrors = error.errors.map(
          (nestedError) => nestedError.dataPath
        );

        const expected = [
          '.string',
          '.array',
          '.object.prop',
          '.object.object.prop',
          '.boolean',
          '.type',
          '.instance',
        ];

        expect(nestedErrors).toMatchObject(expected);
        expect(error.errors).toMatchSnapshot();
      }
    });

    it('invalid schema and has custom error messages', () => {
      expect.assertions(3);

      try {
        validate('test/fixtures/schema-custom-errors.json', options, '{Name}');
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrowErrorMatchingSnapshot();

        const nestedErrors = error.errors.map(
          (nestedError) => nestedError.dataPath
        );

        const expected = [
          '.object.object.prop',
          '.object.prop',
          '.type',
          '.array',
          '.string',
          '.boolean',
          '.instance',
        ];

        expect(nestedErrors).toMatchObject(expected);
        expect(error.errors).toMatchSnapshot();
      }
    });
  });
});
