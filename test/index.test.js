import validate from '../src';

import schema from './fixtures/schema.json';

describe('Validation', () => {
  function createSuccessTestCase(name, config, options = {}) {
    it(`should pass validation for ${name}`, () => {
      let error;

      try {
        validate(schema, config, options.name);
      } catch (maybeValidationError) {
        if (maybeValidationError.name !== 'ValidationError') {
          throw maybeValidationError;
        }

        error = maybeValidationError;
      }

      expect(error).toBeUndefined();
    });
  }

  function createFailedTestCase(name, config, fn, configuration = {}) {
    it(`should fail validation for ${name}`, () => {
      try {
        validate(schema, config, configuration);
      } catch (error) {
        if (error.name !== 'ValidationError') {
          throw error;
        }

        expect(error.message).toMatch(
          new RegExp(
            `^Invalid ${configuration.baseDataPath || 'configuration'} object`
          )
        );
        fn(error.message);

        return;
      }

      throw new Error("Validation didn't fail");
    });
  }

  createSuccessTestCase('empty array', {
    arrayType: [],
  });

  createSuccessTestCase('non empty array', {
    arrayType2: ['1', 2, true],
  });

  createSuccessTestCase('only additional items', {
    onlyAdditionalItems: ['1', 2, true],
  });

  createSuccessTestCase('boolean type', {
    booleanType: true,
  });

  createSuccessTestCase('number keywords without number type', {
    numberWithoutType: true,
  });

  createSuccessTestCase('number keywords without number type #2', {
    numberWithoutType: 25,
  });

  createSuccessTestCase('number keywords without number type #3', {
    numberWithoutType2: true,
  });

  createSuccessTestCase('number keywords without number type #4', {
    numberWithoutType2: 20,
  });

  createSuccessTestCase('string keywords without string type', {
    stringWithoutType: true,
  });

  createSuccessTestCase('string keywords without string type', {
    stringWithoutType: 127,
  });

  createSuccessTestCase('string keywords without string type #2', {
    stringWithoutType: '127.0.0.1',
  });

  createSuccessTestCase('array keywords without array type', {
    arrayWithoutType: true,
  });

  createSuccessTestCase('array keywords without array type #2', {
    arrayWithoutType: [1, 'test', true, false],
  });

  createSuccessTestCase('array keywords without array type #3', {
    arrayWithoutType: 'string',
  });

  createSuccessTestCase('object with required and properties', {
    justAnObject: { foo: 'test', bar: 4, qwerty: 'qwerty' },
  });

  createSuccessTestCase('object with patternRequired', {
    objectTest4: { fao: true, fbo: true, c: true },
  });

  createSuccessTestCase('array with items with true', {
    itemsTrue: [1, 2, 3, 'test'],
  });

  createSuccessTestCase('empty const', {
    emptyConst: '',
  });

  createSuccessTestCase('ref inside object inside allOf', {
    refAndAnyOf: { foo: [/test/] },
  });

  createSuccessTestCase('additionalProperties inside oneOf', {
    additionalPropertiesInsideOneOf: { foo: 100 },
  });

  createSuccessTestCase('additionalProperties inside oneOf #2', {
    additionalPropertiesInsideOneOf2: { foo: 100, bar: 'baz' },
  });

  createSuccessTestCase('single item in contains', {
    singleContainsItems: [1, 'test', true],
  });

  createSuccessTestCase('array with contains', {
    arrayKeyword17: [/test/, 1, 'test', true],
  });

  createSuccessTestCase('const', {
    constKeyword: 'foo',
  });

  createSuccessTestCase('const #2', {
    constKeyword2: ['foo', 'bar'],
  });

  createSuccessTestCase('const with array notation', {
    constWithArrayNotation: [1, 2, 3],
  });

  createSuccessTestCase('const with object notation', {
    constWithObjectNotation: { foo: 'bar', baz: 123 },
  });

  createSuccessTestCase('items and additionalItems', {
    additionalItemsWithoutType: [1, 2, 3, 4, 5],
  });

  createSuccessTestCase('items and additionalItems #2', {
    additionalItemsWithoutType2: [
      1,
      true,
      /test/,
      'string',
      [1, 2, 3],
      { foo: 'bar' },
      null,
    ],
  });

  createSuccessTestCase('items and additionalItems #3', {
    additionalItemsWithoutType3: ['string', 'other-string', 1, true, 2, false],
  });

  createSuccessTestCase('contains and additionalItems', {
    containsAndAdditionalItems: [/test/, true, 'string'],
  });

  createSuccessTestCase('contains and additionalItems', {
    containsAndAdditionalItems: [/test/, 1, 'string'],
  });

  createSuccessTestCase('contains inside items', {
    containsInsideItem: [1, 'test', true, /test/],
  });

  createSuccessTestCase('contains inside items #2', {
    containsInsideItem: ['test', 'test', 'test'],
  });

  createSuccessTestCase('contains inside items #3', {
    containsInsideItem: [['test', 1], '1', /test/],
  });

  createSuccessTestCase('contains inside items #3', {
    containsInsideItem: [[1, 'test'], '1', /test/],
  });

  createSuccessTestCase('object without properties', {
    emptyObject: {},
  });

  createSuccessTestCase('non empty object', {
    nonEmptyObject: { bar: 123 },
  });

  createSuccessTestCase('non empty object #2', {
    nonEmptyObject: {},
  });

  createSuccessTestCase('non empty object #3', {
    nonEmptyObject2: { foo: 'test' },
  });

  createSuccessTestCase('oneOf', {
    optimization: {
      runtimeChunk: {
        name: 'fef',
      },
    },
  });

  createSuccessTestCase('not array', {
    notArray: 1,
  });

  createSuccessTestCase('no type like number with minimum', {
    noTypeLikeNumberMinimum: 6,
  });

  createSuccessTestCase('no type like number with minimum', {
    noTypeLikeNumberMinimum: true,
  });

  createSuccessTestCase('no type like number with maximum', {
    noTypeLikeNumberMaximum: 4,
  });

  createSuccessTestCase('no type like number with maximum', {
    noTypeLikeNumberMaximum: true,
  });

  createSuccessTestCase('no type like number with minimum', {
    noTypeLikeNumberExclusiveMinimum: 6,
  });

  createSuccessTestCase('no type like number with minimum', {
    noTypeLikeNumberExclusiveMinimum: true,
  });

  createSuccessTestCase('no type like number with maximum', {
    noTypeLikeNumberExclusiveMaximum: 4,
  });

  createSuccessTestCase('no type like number with maximum', {
    noTypeLikeNumberExclusiveMaximum: true,
  });

  createSuccessTestCase('no type like number with multipleOf', {
    noTypeLikeNumberMultipleOf: true,
  });

  createSuccessTestCase('no type like string with pattern', {
    noTypeLikeStringPattern: 1,
  });

  createSuccessTestCase('no type like string with pattern #2', {
    noTypeLikeStringPattern: 'a',
  });

  createSuccessTestCase('no type like string with MinLength equals 1', {
    noTypeLikeStringMinLength1: 1,
  });

  createSuccessTestCase('no type like array with additionalItems', {
    noTypeLikeArrayAdditionalItems: true,
  });

  // The "name" option
  createFailedTestCase(
    'webpack name',
    {
      entry: '',
    },
    (msg) => expect(msg).toMatchSnapshot(),
    {
      name: 'Webpack',
    }
  );

  createFailedTestCase(
    'css-loader name',
    {
      entry: '',
    },
    (msg) => expect(msg).toMatchSnapshot(),
    {
      name: 'CSS Loader',
    }
  );

  createFailedTestCase(
    'terser-webpack-plugin name',
    {
      entry: '',
    },
    (msg) => expect(msg).toMatchSnapshot(),
    {
      name: 'Terser Plugin',
    }
  );

  // The "dataPath" option
  createFailedTestCase(
    'configuration dataPath',
    {
      entry: '',
    },
    (msg) => expect(msg).toMatchSnapshot(),
    {
      name: 'Webpack',
      baseDataPath: 'configuration',
    }
  );

  createFailedTestCase(
    'configuration dataPath #1',
    {
      entry: '',
    },
    (msg) => expect(msg).toMatchSnapshot(),
    {
      name: 'MyPlugin',
      baseDataPath: 'options',
    }
  );

  // The "postFormatter" option
  createFailedTestCase(
    'postFormatter',
    {
      debug: true,
    },
    (msg) => expect(msg).toMatchSnapshot(),
    {
      name: 'Webpack',
      baseDataPath: 'configuration',
      postFormatter: (formattedError, error) => {
        if (
          error.keyword === 'additionalProperties' &&
          !error.dataPath &&
          error.params.additionalProperty === 'debug'
        ) {
          return (
            `${formattedError}\n` +
            "The 'debug' property was removed in webpack 2.0.0.\n" +
            'Loaders should be updated to allow passing this option via loader options in module.rules.\n' +
            'Until loaders are updated one can use the LoaderOptionsPlugin to switch loaders into debug mode:\n' +
            'plugins: [\n' +
            '  new webpack.LoaderOptionsPlugin({\n' +
            '    debug: true\n' +
            '  })\n' +
            ']'
          );
        }

        return formattedError;
      },
    }
  );

  createFailedTestCase(
    'postFormatter #1',
    {
      minify: true,
    },
    (msg) => expect(msg).toMatchSnapshot(),
    {
      name: 'Webpack',
      baseDataPath: 'configuration',
      postFormatter: (formattedError, error) => {
        if (
          error.keyword === 'additionalProperties' &&
          !error.dataPath &&
          error.params.additionalProperty
        ) {
          return (
            `${formattedError}\n` +
            'For typos: please correct them.\n' +
            'For loader options: webpack >= v2.0.0 no longer allows custom properties in configuration.\n' +
            '  Loaders should be updated to allow passing options via loader options in module.rules.\n' +
            '  Until loaders are updated one can use the LoaderOptionsPlugin to pass these options to the loader:\n' +
            '  plugins: [\n' +
            '    new webpack.LoaderOptionsPlugin({\n' +
            '      // test: /\\.xxx$/, // may apply this only for some modules\n' +
            '      options: {\n' +
            `        ${error.params.additionalProperty}: …\n` +
            '      }\n' +
            '    })\n' +
            '  ]'
          );
        }

        return formattedError;
      },
    }
  );

  createFailedTestCase(
    'postFormatter #2',
    {
      entry: 'foo.js',
      output: {
        filename: '/bar',
      },
    },
    (msg) => expect(msg).toMatchSnapshot(),
    {
      name: 'Webpack',
      baseDataPath: 'configuration',
      postFormatter: (formattedError, error) => {
        if (
          error.children &&
          error.children.some(
            (child) =>
              child.keyword === 'absolutePath' &&
              child.dataPath === '.output.filename'
          )
        ) {
          return (
            `${formattedError}\n` +
            'Please use output.path to specify absolute path and output.filename for the file name.'
          );
        }

        return formattedError;
      },
    }
  );

  // eslint-disable-next-line no-undefined
  createFailedTestCase('undefined configuration', undefined, (msg) =>
    expect(msg).toMatchSnapshot()
  );

  createFailedTestCase('null configuration', null, (msg) =>
    expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'empty entry string',
    {
      entry: '',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'empty entry bundle array',
    {
      entry: {
        bundle: [],
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'invalid instanceof',
    {
      entry: 'a',
      module: {
        wrappedContextRegExp: 1337,
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'invalid minimum',
    {
      entry: 'a',
      parallelism: 0,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'repeated value',
    {
      entry: ['abc', 'def', 'abc'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multiple errors',
    {
      entry: [/a/],
      output: {
        filename: /a/,
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multiple configurations',
    [
      {
        entry: [/a/],
      },
      {
        entry: 'a',
        output: {
          filename: /a/,
        },
      },
    ],
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'deep error',
    {
      entry: 'a',
      module: {
        rules: [
          {
            oneOf: [
              {
                test: '/a',
                passer: {
                  amd: false,
                },
              },
            ],
          },
        ],
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additional key on root',
    {
      entry: 'a',
      postcss: () => {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'enum',
    {
      entry: 'a',
      devtool: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  // Require for integration with webpack
  createFailedTestCase(
    '! in path',
    {
      entry: 'foo.js',
      output: {
        path: '/somepath/!test',
        filename: 'bar',
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'relative path',
    {
      entry: 'foo.js',
      output: {
        filename: '/bar',
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'absolute path',
    {
      entry: 'foo.js',
      output: {
        filename: 'bar',
      },
      context: 'baz',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'missing stats option',
    {
      entry: 'foo.js',
      stats: {
        foobar: true,
      },
    },
    (msg) => {
      expect(
        msg
          .replace(/object \{ .* \}/g, 'object {...}')
          .replace(/"none" \| .+/g, '"none" | ...')
      ).toMatchSnapshot();
    }
  );

  createFailedTestCase(
    'invalid plugin provided: bool',
    {
      entry: 'foo.js',
      plugins: [false],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'invalid plugin provided: array',
    {
      entry: 'foo.js',
      plugins: [[]],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'invalid plugin provided: string',
    {
      entry: 'foo.js',
      plugins: ['abc123'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'Invalid plugin provided: int',
    {
      entry: 'foo.js',
      plugins: [12],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'Invalid plugin provided: object without apply function',
    {
      entry: 'foo.js',
      plugins: [{}],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'invalid mode',
    {
      mode: 'protuction',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'min length',
    {
      minLengthTwo: '1',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'min properties',
    {
      entry: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'integer type',
    {
      integerType: 'type',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'null type',
    {
      nullType: 'type',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'boolean type',
    {
      bail: 'true',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array type',
    {
      dependencies: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'number type',
    {
      parallelism: '1',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object in object with anyOf',
    {
      allOfRef: { alias: 123 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'non empty string in object with anyOf',
    {
      allOfRef: { aliasFields: 123 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'boolean and object in object with anyOf',
    {
      allOfRef: { unsafeCache: [] },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'boolean and number in object with anyOf',
    {
      watchOptions: { poll: '1' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'integer and null in object with anyOf',
    {
      customObject: { anyOfKeyword: '1' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxLength',
    {
      customObject: { maxLength: '11111' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxItems',
    {
      customObject: { maxItems: ['1', '2', '3', '4'] },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxProperties',
    {
      customObject: {
        maxProperties: { one: 'one', two: 'two', three: 'three', four: 'four' },
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'minimum',
    {
      customObject: { minimumKeyword: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maximum',
    {
      customObject: { maximumKeyword: 11111 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multipleOf',
    {
      customObject: { multipleOfKeyword: 11111 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'pattern',
    {
      customObject: { patternKeyword: 'def' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'format',
    {
      customObject: { formatKeyword: 'def' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'contains',
    {
      customObject: { containsKeyword: ['def'] },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'contains #1',
    {
      multipleContains2: [/test/],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'oneOf #1',
    {
      entry: { foo: () => [] },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'oneOf #2',
    {
      optimization: {
        runtimeChunk: {
          name: /fef/,
        },
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'oneOf #3',
    {
      optimization: {
        runtimeChunk: (name) => name,
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'allOf',
    {
      objectType: { objectProperty: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'anyOf',
    {
      anyOfKeyword: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array without items',
    {
      nestedArrayWithoutItems: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object without items',
    {
      nestedObjectWithoutItems: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multiple types in array',
    {
      arrayType2: ['1', 2, true, /test/],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multiple types',
    {
      multipleTypes: /test/,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'zero max items',
    {
      zeroMaxItems: [1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multiple types in contains',
    {
      multipleContains: [/test/],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'exclusiveMinimum',
    {
      exclusiveMinimumKeyword: 4.5,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'exclusiveMaximum',
    {
      exclusiveMaximumKeyword: 5.5,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'uniqueItems',
    {
      uniqueItemsKeyword: [1, 2, 1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'minProperties',
    {
      minPropertiesKeyword: { foo: 'bar' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxProperties',
    {
      maxPropertiesKeyword: { foo: 'bar', bar: 'foo', foobaz: 'foobaz' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'required',
    {
      requiredKeyword: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'required #2',
    {
      requiredKeyword: { b: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'required with additionalProperties',
    {
      requiredKeywordWithAdditionalProperties: { b: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'enum',
    {
      enumKeyword: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'formatMinimum',
    {
      formatMinimumKeyword: '2016-02-05',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'formatMaximum',
    {
      formatMaximumKeyword: '2016-02-07',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'formatExclusiveMinimum',
    {
      formatExclusiveMinimumKeyword: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'formatExclusiveMaximum',
    {
      formatExclusiveMaximumKeyword: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'format and formatMinimum and formatMaximum and formatExclusiveMaximum',
    {
      formatMinMaxExclusiveMinKeyword: '2016-02-05',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'format and formatMinimum and formatMaximum and formatExclusiveMaximum',
    {
      formatMinMaxExclusiveMaxKeyword: '2016-02-05',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'minItems Keyword',
    {
      minItemsKeyword: ['1'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxItems Keyword',
    {
      maxItemsKeyword: ['1', '2', '3', '4'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'items',
    {
      itemsKeyword: ['1'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'items',
    {
      itemsKeyword2: [true],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalItems',
    {
      additionalItemsKeyword: [1, 'abc'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalItems #2',
    {
      additionalItemsKeyword2: ['abc'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalItems #3',
    {
      additionalItemsKeyword3: ['abc'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalItems #4',
    {
      additionalItemsKeyword4: [1, 1, 'foo'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'properties',
    {
      propertiesKeyword: { foo: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'patternProperties',
    {
      patternPropertiesKeyword: { foo: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'patternProperties #1',
    {
      patternPropertiesKeyword2: { b: 't' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with only number',
    {
      arrayWithOnlyNumber: ['foo'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'only required',
    {
      onlyRequired: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'dependencies',
    {
      dependenciesKeyword: { foo: 1, bar: 2 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'dependencies #2',
    {
      dependenciesKeyword2: { foo: 1, bar: '2' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'patternRequired',
    {
      patternRequiredKeyword: { bar: 2 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'patternRequired #2',
    {
      patternRequiredKeyword2: { foo: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'only properties',
    {
      onlyProperties: { foo: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'only properties #2',
    {
      onlyProperties2: { foo: 'a', bar: 2, break: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'only items',
    {
      onlyItems: [1, 'abc'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'only items #2',
    {
      onlyItems2: ['abc', 1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties',
    {
      additionalPropertiesKeyword: { a: 3 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties #2',
    {
      additionalPropertiesKeyword: { foo: 1, baz: 3 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties #3',
    {
      additionalPropertiesKeyword: { foo: '1', baz: 3 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties #4',
    {
      additionalPropertiesKeyword2: { a: 3 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties #5',
    {
      additionalPropertiesKeyword2: { foo: 1, baz: 3 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties #6',
    {
      additionalPropertiesKeyword2: { foo: 1, bar: '3' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'propertyNames',
    {
      propertyNamesKeyword: { foo: 'any value' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'constKeyword',
    {
      constKeyword: 'bar',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'constKeyword #2',
    {
      constKeyword2: 'baz',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'if/then/else',
    {
      ifThenElseKeyword: { power: 10000 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'if/then/else #2',
    {
      ifThenElseKeyword: { power: 10000, confidence: true },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'if/then/else #3',
    {
      ifThenElseKeyword: { power: 1000 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'if/then/else #4',
    {
      ifThenElseKeyword2: 11,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'if/then/else #5',
    {
      ifThenElseKeyword2: 2000,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'if/then/else #6',
    {
      ifThenElseKeyword2: 0,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'string',
    {
      stringKeyword: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'string #1',
    {
      stringKeyword: 'abc',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array',
    {
      arrayKeyword: 'abc',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #1',
    {
      arrayKeyword: ['abc'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #2',
    {
      arrayKeyword: [1, 'string', 1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #3',
    {
      arrayKeyword: [1, 'string', '1', 'other', 'foo'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #4',
    {
      arrayKeyword2: [1, '1', 1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #5',
    {
      arrayKeyword2: [1, 2, true, false],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #4',
    {
      arrayKeyword3: ['1', '2', '3'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #5',
    {
      arrayKeyword3: [1, '1', 1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #6',
    {
      arrayKeyword3: [1, 2, true, false],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #7',
    {
      arrayKeyword4: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #8',
    {
      arrayKeyword5: [1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #9',
    {
      arrayKeyword6: [1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #10',
    {
      arrayKeyword6: ['true', '1'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #11',
    {
      arrayKeyword6: [true, '1'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #12',
    {
      arrayKeyword7: ['test', 1, /test/],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #13',
    {
      arrayKeyword8: ['test', 1, 'test', true],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #14',
    {
      arrayKeyword8: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #15',
    {
      arrayKeyword9: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #16',
    {
      arrayKeyword10: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #17',
    {
      arrayKeyword11: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #18',
    {
      arrayKeyword12: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #19',
    {
      arrayKeyword13: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #20',
    {
      arrayKeyword14: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #21',
    {
      arrayKeyword15: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #22',
    {
      arrayKeyword16: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #23',
    {
      arrayKeyword17: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #24',
    {
      arrayKeyword17: [1, /test/, () => {}],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #25',
    {
      arrayKeyword18: [1, 2, 3],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array #26',
    {
      arrayKeyword19: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'recursion',
    {
      recursion: { person: { name: 'Foo', children: {} } },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'extending',
    {
      extending: {
        shipping_address: {
          street_address: '1600 Pennsylvania Avenue NW',
          city: 'Washington',
          state: 'DC',
        },
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'module',
    {
      module: { rules: [{ compiler: true }] },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with string items and minLength',
    {
      longString: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'integer with minimum',
    {
      integerWithMinimum: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'integer with minimum and maximum',
    {
      integerWithMinimum: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'integer with exclusive minimum',
    {
      integerWithExclusiveMinimum: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'integer with exclusive minimum',
    {
      integerWithExclusiveMinimum: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'integer with exclusive maximum',
    {
      integerWithExclusiveMaximum: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'integer with exclusive maximum',
    {
      integerWithExclusiveMaximum: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'number with minimum and maximum',
    {
      numberWithMinimum: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multipleOf with minimum and maximum',
    {
      multipleOfProp: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'string with minLength, maxLength and pattern',
    {
      stringWithMinAndMaxLength: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'string with minLength and maxLength',
    {
      stringWithMinAndMaxLength: 'def',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'format, formatMaximum and formatExclusiveMaximum',
    {
      strictFormat: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'format, formatMaximum and formatExclusiveMaximum #2',
    {
      strictFormat: '2016-02-07',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'format, formatMinimum and formatExclusiveMinimum',
    {
      strictFormat2: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'format, formatMinimum and formatExclusiveMinimum #2',
    {
      strictFormat2: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'uniqueItems',
    {
      uniqueItemsProp: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'uniqueItems #2',
    {
      uniqueItemsProp: [1, 1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxProperties and minProperties',
    {
      maxPropertiesAndMinProperties: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxProperties and minProperties #2',
    {
      maxPropertiesAndMinProperties: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxProperties and minProperties #3',
    {
      maxPropertiesAndMinProperties: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object',
    {
      objectTest: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #2',
    {
      objectTest2: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #3',
    {
      objectTest3: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #4',
    {
      objectTest4: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #5',
    {
      objectTest4: { foo: 'test', b: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #6',
    {
      objectTest5: {
        'foo@gmail.com.com': 1,
        'foo1@bar.com': 1,
        'foo@bar.com': 1,
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #7',
    {
      objectTest5: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #8',
    {
      objectTest6: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #9',
    {
      objectTest7: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #9',
    {
      objectTest8: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #10',
    {
      objectTest7: { baz: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #11',
    {
      objectTest9: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object #12',
    {
      objectTest9: { foo: 'test', baz: 'test', bar: 1 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'string with empty pattern',
    {
      stringWithEmptyPattern: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array keywords without array type',
    {
      likeArray: ['test'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with empty items, empty additionalItems, empty contains',
    {
      arrayWithEmptyItemsAndEmptyAdditionalItemsAndEmptyContains: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalItems with false',
    {
      additionalItemsFalse: [1, 1, 'foo'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'required without object type',
    {
      requiredWithoutType: { b: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'dependencies without object type',
    {
      dependenciesWithoutType: { foo: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'propertyNames without object type',
    {
      propertyNamesWithoutType: { foo: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'patternRequired without object type',
    {
      patternRequiredWithoutType: { boo: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties without object type',
    {
      additionalPropertiesWithoutType: { boo: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxProperties without object type',
    {
      maxPropertiesWithoutType: { boo: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object with required and properties',
    {
      justAnObject: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with absolutePath item',
    {
      arrayWithAbsolutePath: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'allOf',
    {
      allOfKeyword: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'allOf #1',
    {
      allOfKeyword: 4.5,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'allOf #2',
    {
      allOfKeyword: 5,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'oneOf with description',
    {
      oneOfnumberAndDescriptionAndArray: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'number and description',
    {
      numberAndDescription: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'const with description',
    {
      constWithDescription: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with items with true',
    {
      itemsTrue: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'empty const',
    {
      emptyConst: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'one const',
    {
      oneConst: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'const with empty string',
    {
      constWithEmptyString: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'ref inside object inside allOf',
    {
      refAndAnyOf: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties inside oneOf',
    {
      additionalPropertiesInsideOneOf: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties inside oneOf #2',
    {
      additionalPropertiesInsideOneOf: { foo: 100, bar: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'additionalProperties inside oneOf #3',
    {
      additionalPropertiesInsideOneOf2: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'single item in contains',
    {
      singleContainsItems: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object with dependencies',
    {
      objectWithPropertyDependency: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object with dependencies #2',
    {
      objectWithPropertyDependency2: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object with dependencies #3',
    {
      objectWithPropertyDependency3: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object with dependencies #4',
    {
      objectWithPropertyDependency4: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'oneOf with if',
    {
      oneOfWithIf: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'const with array notation',
    {
      constWithArrayNotation: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'const with object notation',
    {
      constWithObjectNotation: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'items and additionalItems',
    {
      additionalItemsWithoutType: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'items and additionalItems #2',
    {
      additionalItemsWithoutType2: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'items and additionalItems #3',
    {
      additionalItemsWithoutType3: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'contains and additionalItems',
    {
      containsAndAdditionalItems: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'contains and additionalItems #2',
    {
      containsAndAdditionalItems: [/test/, 'string'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'contains inside items',
    {
      containsInsideItem: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'contains inside items #2',
    {
      containsInsideItem: [['test'], '1', /test/],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'empty object',
    {
      emptyObject: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'empty object #2',
    {
      emptyObject: { a: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'non empty object',
    {
      nonEmptyObject: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'non empty object #2',
    {
      nonEmptyObject2: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'holey array',
    // eslint-disable-next-line no-sparse-arrays
    [
      {
        mode: 'production',
      },
      ,
      {
        mode: 'development',
      },
    ],
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'missing cache group name',
    {
      optimization: {
        splitChunks: {
          cacheGroups: {
            test: /abc/,
          },
        },
      },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not enum',
    {
      notEnum: 2,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not const',
    {
      notConst: 'foo',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not number',
    {
      notNumber: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not integer',
    {
      notNumber: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not string',
    {
      notString: 'test',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not boolean',
    {
      notBoolean: true,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not array',
    {
      notArray: [1, 2, 3],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not object',
    {
      notObject: { foo: 'test' },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not null',
    {
      notNull: null,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not not null',
    {
      notNotNull: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not not not null',
    {
      NotNotNotNull: null,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not not not null',
    {
      notMultipleTypes: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'not array less than 3 items',
    {
      notMaxItemsArray: [1, 2],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like number with minimum',
    {
      noTypeLikeNumberMinimum: 4,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like number with maximum',
    {
      noTypeLikeNumberMaximum: 6,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like number with exclusive minimum',
    {
      noTypeLikeNumberExclusiveMinimum: 4,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like number with exclusive maximum',
    {
      noTypeLikeNumberExclusiveMaximum: 6,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'minimum with type number',
    {
      minimumWithTypeNumber: 4,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maximum with type number',
    {
      maximumWithTypeNumber: 6,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'exclusive minimum with type number',
    {
      exclusiveMinimumWithTypeNumber: 4,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'exclusive maximum with type number',
    {
      exclusiveMaximumWithTypeNumber: 6,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like number with multipleOf',
    {
      noTypeLikeNumberMultipleOf: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multipleOf with type number',
    {
      multipleOfWithNumberType: 1,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like string with minLength',
    {
      noTypeLikeStringMinLength: 'a',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like string with maxLength',
    {
      noTypeLikeStringMaxLength: 'aaa',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'minLength with type string',
    {
      stringWithMinLength: 'a',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'maxLength with type string',
    {
      stringWithMaxLength: 'aaa',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like string with pattern',
    {
      noTypeLikeStringPattern: 'def',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'pattern with type string',
    {
      patternWithStringType: 'def',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like string with format',
    {
      noTypeLikeStringFormat: 'abc',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'format with type string',
    {
      stringWithFormat: 'abc',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like string with formatMaximum',
    {
      noTypeLikeStringFormatMaximum: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'formatMaximum with type string',
    {
      stringWithFormatMaximum: '2016-02-06',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'multiple instanceof ',
    {
      multipleInstanceof: 'test',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like object with patternRequired',
    {
      noTypeLikeObjectPatternRequired: { bar: 2 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'patternRequired with type object',
    {
      objectWithPatternRequired: { bar: 2 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like string with minLength equals 1',
    {
      noTypeLikeStringMinLength1: '',
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like array with minItems equals 1',
    {
      noTypeLikeArrayMinItems1: [],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like array with minItems',
    {
      noTypeLikeArrayMinItems: [],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with minItems',
    {
      arrayWithMinItems: [],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like array with minItems',
    {
      noTypeMinProperties: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like array with minItems',
    {
      noTypeMinProperties1: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like array with minItems',
    {
      objectMinProperties: {},
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like array with maxItems',
    {
      noTypeLikeArrayMaxItems: [1, 2, 3, 4],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with maxItems',
    {
      arrayMaxItems: [1, 2, 3, 4],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like object with maxProperties',
    {
      noTypeLikeObjectMaxProperties: { a: 1, b: 2, c: 3 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object with maxProperties',
    {
      objectMaxProperties: { a: 1, b: 2, c: 3 },
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like object with maxProperties',
    {
      noTypeLikeArrayUniqueItems: [1, 2, 1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'object with maxProperties',
    {
      arrayWithUniqueItems: [1, 2, 1],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like array with additionalItems',
    {
      noTypeLikeArrayAdditionalItems: [1, 1, 'foo'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with additionalItems',
    {
      arrayWithAdditionalItems: [1, 1, 'foo'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'no type like array with contains',
    {
      noTypeLikeArrayContains: ['foo', 'bar'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'array with contains',
    {
      arrayWithContains: ['foo', 'bar'],
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'anyOf with item without type',
    {
      anyOfNoTypeInItem: 4.5,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );

  createFailedTestCase(
    'oneOf with item without type',
    {
      oneOfNoTypeInItem: 4.5,
    },
    (msg) => expect(msg).toMatchSnapshot()
  );
});
