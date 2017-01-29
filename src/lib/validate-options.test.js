import assert from 'assert';
import validateOptions from './validate-options';

const generateProperties = (entry) => {
  const ret = {};

  Object.keys(entry).forEach((e) => {
    ret[e] = {
      type: ['array', 'string'],
      items: {
        type: 'string',
      },
    };
  });

  return ret;
};

const parsePaths = (entry) => {
  const ret = {
    type: ['array', 'object'],
  };

  if (entry instanceof Object) {
    ret.additionalProperties = false;
    ret.properties = generateProperties(entry);
  } else {
    ret.items = {
      type: 'string',
    };
  }

  return ret;
};

const testSchema = ({ entry } = {}) => {
  return {
    $schema: 'http://json-schema.org/draft-04/schema#',
    additionalProperties: false,
    type: 'object',
    properties: {
      styleExtensions: {
        type: 'array',
        items: {
          type: 'string',
        },
        default: ['.css'],
      },
      minimize: {
        type: 'boolean',
      },
      moduleExtensions: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      paths: parsePaths(entry),
      purifyOptions: {
        type: 'object',
        properties: {},
      },
      verbose: {
        type: 'boolean',
      },
    },
    required: [
      'paths',
    ],
  };
};

describe('Validate options', () => {
  it('fails without a schema and data', () => {
    assert.throws(
      () => {
        validateOptions();
      },
      Error,
    );
  });

  it('fails with empty data', () => {
    const result = validateOptions(testSchema());

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('does not fail if paths are provided', () => {
    const result = validateOptions(testSchema(), { paths: ['./foo'] });

    assert.ok(result.isValid);
    assert.ok(!result.error);
  });

  it('does not allow arbitrary properties', () => {
    const result = validateOptions(testSchema(), { paths: ['./foo'], foobar: ['./foo'] });

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('styleExtensions have defaults', () => {
    const paths = ['./foo'];
    const data = { paths };

    const result = validateOptions(testSchema(), data);

    assert.deepEqual(data, { paths, styleExtensions: ['.css'] });
    assert.ok(!result.error);
  });

  it('fails without matching path keys', () => {
    const data = {
      paths: {
        a: './foo',
      },
    };

    const result = validateOptions(testSchema({
      entry: {
        b: './bar',
      },
    }), data);

    assert.ok(result.error);
  });
});
