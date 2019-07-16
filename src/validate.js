import Ajv from 'ajv';
import ajvKeywords from 'ajv-keywords';

import absolutePathKeyword from './keywords/absolutePath';

import ValidationError from './ValidationError';

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

ajvKeywords(ajv, [
  'instanceof',
  'formatMinimum',
  'formatMaximum',
  'patternRequired',
]);

// Custom keywords
absolutePathKeyword(ajv);

function validate(schema, options, configuration = {}) {
  let errors = [];

  if (Array.isArray(options)) {
    errors = options.map((nestedOptions) =>
      validateObject(schema, nestedOptions)
    );

    errors.forEach((list, idx) => {
      const applyPrefix = (error) => {
        // eslint-disable-next-line no-param-reassign
        error.dataPath = `[${idx}]${error.dataPath}`;

        if (error.children) {
          error.children.forEach(applyPrefix);
        }
      };

      list.forEach(applyPrefix);
    });

    errors = errors.reduce((arr, items) => arr.concat(items), []);
  } else {
    errors = validateObject(schema, options);
  }

  if (errors.length > 0) {
    throw new ValidationError(errors, schema, configuration);
  }

  return errors;
}

function validateObject(schema, options) {
  const compiledSchema = ajv.compile(schema);
  const valid = compiledSchema(options);

  return valid ? [] : filterErrors(compiledSchema.errors);
}

function filterErrors(errors) {
  let newErrors = [];

  for (const error of errors) {
    const { dataPath } = error;
    let children = [];

    newErrors = newErrors.filter((oldError) => {
      if (oldError.dataPath.includes(dataPath)) {
        if (oldError.children) {
          children = children.concat(oldError.children.slice(0));
        }

        // eslint-disable-next-line no-undefined, no-param-reassign
        oldError.children = undefined;
        children.push(oldError);

        return false;
      }

      return true;
    });

    if (children.length) {
      error.children = children;
    }

    newErrors.push(error);
  }

  return newErrors;
}

export default validate;
