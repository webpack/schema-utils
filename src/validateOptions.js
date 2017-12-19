import path from 'path';
import fs from 'fs';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import ValidationError from './ValidationError';

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  errorDataPath: 'property',
});

ajvKeywords(ajv, ['instanceof', 'typeof']);

const validateOptions = (schema, options, name) => {
  if (typeof schema === 'string') {
    schema = fs.readFileSync(path.resolve(schema), 'utf8');
    schema = JSON.parse(schema);
  }

  if (!ajv.validate(schema, options)) {
    throw new ValidationError(ajv.errors, name);
  }

  return true;
};

export default validateOptions;
