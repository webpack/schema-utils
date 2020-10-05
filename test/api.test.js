import { validate, ValidationError } from '../src/index';

import schema from './fixtures/schema.json';
import schemaTitle from './fixtures/schema-title.json';
import schemaTitleBrone from './fixtures/schema-title-broken.json';

describe('api', () => {
  it('should export validate and ValidateError', () => {
    expect(typeof validate).toBe('function');
    expect(typeof ValidationError).toBe('function');
  });

  it('should work', () => {
    validate(schema, { minimumWithTypeNumber: 5 });
  });

  it('should work when options will be changed', () => {
    expect.assertions(1);

    const options = { minimumWithTypeNumber: 5 };

    validate(schema, options);

    options.minimumWithTypeNumber = 1;

    try {
      validate(schema, options);
    } catch (error) {
      expect(error).toBeDefined();
    }

    options.minimumWithTypeNumber = 120;

    validate(schema, options);
  });

  it('should get configuration from schema', () => {
    try {
      validate(schemaTitle, { foo: 'bar' });
    } catch (error) {
      if (error.name !== 'ValidationError') {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should prefer configuration over "title"', () => {
    try {
      validate(
        schemaTitle,
        { foo: 'bar' },
        { name: 'NAME', baseDataPath: 'BaseDataPath' }
      );
    } catch (error) {
      if (error.name !== 'ValidationError') {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should prefer configuration over "title" #1', () => {
    try {
      validate(schemaTitle, { foo: 'bar' }, { name: 'NAME' });
    } catch (error) {
      if (error.name !== 'ValidationError') {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should prefer configuration over "title" #2', () => {
    try {
      validate(schemaTitle, { foo: 'bar' }, { baseDataPath: 'BaseDataPath' });
    } catch (error) {
      if (error.name !== 'ValidationError') {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });

  it('should use default values when "title" is broken', () => {
    try {
      validate(schemaTitleBrone, { foo: 'bar' });
    } catch (error) {
      if (error.name !== 'ValidationError') {
        throw error;
      }

      expect(error.message).toMatchSnapshot();
    }
  });
});
