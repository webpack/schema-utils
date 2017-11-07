/* eslint-disable
  import/order,
  no-param-reassign,
  array-bracket-spacing,
*/
import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import ValidationError from './ValidationError';

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  errorDataPath: 'property',
});

ajvKeywords(ajv, [ 'instanceof', 'typeof' ]);

const validateOptions = (schema, options, name) => {
  if (typeof schema === 'string') {
    schema = fs.readFileSync(path.resolve(schema), 'utf8');
    schema = JSON.parse(schema);
  }

  if (!ajv.validate(schema, options)) {
    try {
      throw new ValidationError(ajv.errors, name);
    } catch (err) {
      console.error(chalk.bold.red(`\n${err.message}\n`));

      // rethrow {Error} for testing only
      if (process.env.JEST) {
        throw err;
      }

      process.exit(1);
    }
  }

  return true;
};

export default validateOptions;
