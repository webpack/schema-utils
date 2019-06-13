import fs from 'fs';
import path from 'path';

import Ajv from 'ajv';
import errors from 'ajv-errors';
import keywords from 'ajv-keywords';

import ValidationError from './ValidationError';

const ajv = new Ajv({
  allErrors: true,
  jsonPointers: true,
});

errors(ajv);
keywords(ajv, ['instanceof', 'typeof']);

function validate(schema, options, name) {
  if (typeof schema === 'string') {
    // eslint-disable-next-line no-param-reassign
    schema = JSON.parse(fs.readFileSync(path.resolve(schema), 'utf8'));
  }

  if (!ajv.validate(schema, options)) {
    throw new ValidationError(ajv.errors, name);
  }

  return true;
}

export default validate;
