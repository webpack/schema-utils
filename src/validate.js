import ValidationError from "./ValidationError";
import memoize from "./util/memorize";

const getAjv = memoize(() => {
  // Use CommonJS require for ajv libs so TypeScript consumers aren't locked into esModuleInterop (see #110).
  // eslint-disable-next-line global-require
  const Ajv = require("ajv").default;
  // eslint-disable-next-line global-require
  const ajvKeywords = require("ajv-keywords").default;
  // eslint-disable-next-line global-require
  const addFormats = require("ajv-formats").default;

  /**
   * @type {Ajv}
   */
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true,
    $data: true,
  });

  ajvKeywords(ajv, ["instanceof", "patternRequired"]);
  addFormats(ajv, { keywords: true });

  // Custom keywords
  // eslint-disable-next-line global-require
  const addAbsolutePathKeyword = require("./keywords/absolutePath").default;

  addAbsolutePathKeyword(ajv);

  const addUndefinedAsNullKeyword =
    // eslint-disable-next-line global-require
    require("./keywords/undefinedAsNull").default;

  addUndefinedAsNullKeyword(ajv);

  return ajv;
});

/** @typedef {import("json-schema").JSONSchema4} JSONSchema4 */
/** @typedef {import("json-schema").JSONSchema6} JSONSchema6 */
/** @typedef {import("json-schema").JSONSchema7} JSONSchema7 */
/** @typedef {import("ajv").ErrorObject} ErrorObject */

/**
 * @typedef {Object} Extend
 * @property {string=} formatMinimum
 * @property {string=} formatMaximum
 * @property {string=} formatExclusiveMinimum
 * @property {string=} formatExclusiveMaximum
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
  error.instancePath = `[${idx}]${error.instancePath}`;

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

/**
 * @param {Schema} schema
 * @param {Array<object> | object} options
 * @returns {Array<SchemaUtilErrorObject>}
 */
function validateObject(schema, options) {
  const compiledSchema = getAjv().compile(schema);
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
    const { instancePath } = error;
    /** @type {Array<SchemaUtilErrorObject>} */
    let children = [];

    newErrors = newErrors.filter((oldError) => {
      if (oldError.instancePath.includes(instancePath)) {
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
