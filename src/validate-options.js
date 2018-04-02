import path from 'path';
import fs from 'fs';
import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';
import weblog from 'webpack-log';
import optionsSchema from '../schema/options.json';
import ValidationError from './ValidationError';

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  errorDataPath: 'property',
});
const defaults = {
  exit: false,
  log: false,
  name: '',
  schema: '',
  target: {},
  throw: true,
};
const logName = 'schema-utils';

ajvKeywords(ajv, ['instanceof', 'typeof']);

const validate = (options) => {
  let schema;

  if (typeof options.schema === 'string') {
    schema = fs.readFileSync(path.resolve(options.schema), 'utf8');
    schema = JSON.parse(schema);
  } else {
    schema = Object.assign({}, options.schema);
  }

  if (!ajv.validate(schema, options.target)) {
    let { errors } = ajv;

    errors = errors.sort((a, b) => {
      const aPath = a.dataPath;
      const bPath = b.dataPath;

      if (aPath.startsWith('[')) {
        if (!bPath.startsWith('[')) {
          return -1;
        }

        return aPath < bPath ? -1 : 1;
      }

      if (aPath.startsWith('.') && bPath.startsWith('.')) {
        return aPath < bPath ? -1 : 1;
      }

      return 0;
    });

    const err = new ValidationError(Object.assign(options, { errors }));

    if (options.throw) {
      throw err;
    }

    if (options.log) {
      const log = weblog({ name: options.name || logName, id: logName });
      log.error(`${err.meta.desc}\n\n${err.format()}\n`);
    }

    if (options.exit) {
      process.exit(1);
    }
  }

  return true;
};

const validator = (opts) => {
  validate({
    throw: true,
    schema: optionsSchema,
    target: opts,
  });

  const options = Object.assign({}, defaults, opts);

  return validate(options);
};

export default validator;
