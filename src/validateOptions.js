/* eslint-disable
  strict,
  no-param-reassign
*/

'use strict';

const fs = require('fs');
const path = require('path');

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

const passed = new WeakSet();

const validateOptions = (schema, options, name) => {
  if (!passed.has(options)) {
    if (typeof schema === 'string') {
      schema = fs.readFileSync(path.resolve(schema), 'utf8');
      schema = JSON.parse(schema);
    }

    if (!ajv.validate(schema, options)) {
      throw new ValidationError(ajv.errors, name);
    }

    passed.add(options);
  }

  return true;
};

module.exports = validateOptions;
