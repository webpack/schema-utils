import schemaUtils from '../src/index';

import schema from './fixtures/schema.json';

describe('api', () => {
  it('should export validate and ValidateError', () => {
    expect(typeof schemaUtils).toBe('function');
    expect(typeof schemaUtils.ValidateError).toBe('function');
  });

  it('should work', () => {
    schemaUtils(schema, { minimumWithTypeNumber: 5 });
  });

  it('should work when options will be changed', () => {
    expect.assertions(1);

    const options = { minimumWithTypeNumber: 5 };

    schemaUtils(schema, options);

    options.minimumWithTypeNumber = 1;

    try {
      schemaUtils(schema, options);
    } catch (error) {
      expect(error).toBeDefined();
    }

    options.minimumWithTypeNumber = 120;

    schemaUtils(schema, options);
  });
});
