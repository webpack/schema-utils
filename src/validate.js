import addAbsolutePathKeyword from "./keywords/absolutePath";
import addUndefinedAsNullKeyword from "./keywords/undefinedAsNull";

import ValidationError from "./ValidationError";

/**
 * @template T
 * @param fn {(function(): any) | undefined}
 * @returns {function(): T}
 */
const memoize = (fn) => {
  let cache = false;
  /** @type {T} */
  let result;

  return () => {
    if (cache) {
      return result;
    }
    result = /** @type {function(): any} */ (fn)();
    cache = true;
    // Allow to clean up memory for fn
    // and all dependent resources
    // eslint-disable-next-line no-undefined, no-param-reassign
    fn = undefined;

    return result;
  };
};

const getAjv = memoize(() => {
  // Use CommonJS require for ajv libs so TypeScript consumers aren't locked into esModuleInterop (see #110).
  // eslint-disable-next-line global-require
  const Ajv = require("ajv");
  // eslint-disable-next-line global-require
  const ajvKeywords = require("ajv-keywords");

  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    $data: true,
  });

  ajvKeywords(ajv, [
    "instanceof",
    "formatMinimum",
    "formatMaximum",
    "patternRequired",
  ]);

  // Custom keywords
  addAbsolutePathKeyword(ajv);
  addUndefinedAsNullKeyword(ajv);

  return ajv;
});

/** @typedef {import("json-schema").JSONSchema4} JSONSchema4 */
/** @typedef {import("json-schema").JSONSchema6} JSONSchema6 */
/** @typedef {import("json-schema").JSONSchema7} JSONSchema7 */
/** @typedef {import("ajv").ErrorObject} ErrorObject */
/** @typedef {import("ajv").ValidateFunction} ValidateFunction */

/**
 * @typedef {Object} Extend
 * @property {number=} formatMinimum
 * @property {number=} formatMaximum
 * @property {boolean=} formatExclusiveMinimum
 * @property {boolean=} formatExclusiveMaximum
 * @property {string=} link
 * @property {boolean=} undefinedAsNull
 */

/** @typedef {(JSONSchema4 | JSONSchema6 | JSONSchema7) & Extend} Schema */

/** @typedef {ErrorObject & { children?: Array<ErrorObject>}} SchemaUtilErrorObject */

/**
 * @callback PostFormatter
 * @param {string} formattedError
 * @param {SchemaUtilErrorObject} error
 * @returns {string}
 */

/**
 * @typedef {Object} ValidationErrorConfiguration
 * @property {string=} name
 * @property {string=} baseDataPath
 * @property {PostFormatter=} postFormatter
 */

/**
 * @param {SchemaUtilErrorObject} error
 * @param {number} idx
 * @returns {SchemaUtilErrorObject}
 */
function applyPrefix(error, idx) {
  // eslint-disable-next-line no-param-reassign
  error.dataPath = `[${idx}]${error.dataPath}`;

  if (error.children) {
    error.children.forEach((err) => applyPrefix(err, idx));
  }

  return error;
}

/**
 * @param {Schema} schema
 * @param {Array<object> | object} options
 * @param {ValidationErrorConfiguration=} configuration
 * @returns {void}
 */
function validate(schema, options, configuration) {
  let errors = [];

  if (Array.isArray(options)) {
    for (let i = 0; i <= options.length - 1; i++) {
      errors.push(
        ...validateObject(schema, options[i]).map((err) => applyPrefix(err, i))
      );
    }
  } else {
    errors = validateObject(schema, options);
  }

  if (errors.length > 0) {
    throw new ValidationError(errors, schema, configuration);
  }
}

/** @typedef {WeakMap<Schema, ValidateFunction>} */
const schemaCache = new WeakMap();

/**
 * @param {Schema} schema
 * @param {Array<object> | object} options
 * @returns {Array<SchemaUtilErrorObject>}
 */
function validateObject(schema, options) {
  let compiledSchema = schemaCache.get(schema);

  if (!compiledSchema) {
    compiledSchema = getAjv().compile(schema);
    schemaCache.set(schema, compiledSchema);
  }

  const valid = compiledSchema(options);

  if (valid) return [];

  return compiledSchema.errors ? filterErrors(compiledSchema.errors) : [];
}

/**
 * @param {Array<ErrorObject>} errors
 * @returns {Array<SchemaUtilErrorObject>}
 */
function filterErrors(errors) {
  /** @type {Array<SchemaUtilErrorObject>} */
  let newErrors = [];

  for (const error of /** @type {Array<SchemaUtilErrorObject>} */ (errors)) {
    const { dataPath } = error;
    /** @type {Array<SchemaUtilErrorObject>} */
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

export { validate, ValidationError };
