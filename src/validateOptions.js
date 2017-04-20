import fs from 'fs';
import path from 'path'; // eslint-disable-line

import Ajv from 'ajv';
import ValidationError from './ValidationError';

const validateOptions = (schema, options, name) => {
  const ajv = new Ajv({
    useDefaults: true,
    allErrors: true,
    errorDataPath: 'property',
  });

  if (typeof schema === 'string') {
    schema = fs.readFileSync(path.resolve(schema), 'utf8'); // eslint-disable-line
    schema = JSON.parse(schema); // eslint-disable-line
  }

  if (!ajv.validate(schema, options)) {
    throw new ValidationError(ajv.errors, name);
  }

  return true;
};

export default validateOptions;
