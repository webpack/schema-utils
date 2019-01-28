/* eslint-disable
  strict,
  no-param-reassign
*/

'use strict';

const Ajv = require('ajv');
const errors = require('ajv-errors');
const keywords = require('ajv-keywords');

const ValidationError = require('./ValidationError');

const ajv = new Ajv({
  allErrors: true,
  jsonPointers: true,
});

errors(ajv);
keywords(ajv, ['instanceof', 'typeof']);

const passedBySchema = new WeakMap();

const validateOptions = (schema, options, name) => {
  const passed = passedBySchema.get(schema);

  if (passed) {
    if (!passed.has(options)) {
      if (!ajv.validate(schema, options)) {
        throw new ValidationError(ajv.errors, name);
      }

      passed.add(options);
    }
  } else {
    if (!ajv.validate(schema, options)) {
      throw new ValidationError(ajv.errors, name);
    }

    passedBySchema.set(schema, new WeakSet([options]));
  }

  return true;
};

module.exports = validateOptions;
module.exports.ajv = ajv;
