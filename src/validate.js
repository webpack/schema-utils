import ValidationError from "./ValidationError";
import memoize from "./util/memorize";

const getAjv = memoize(() => {
  // Use CommonJS require for ajv libs so TypeScript consumers aren't locked into esModuleInterop (see #110).

  const Ajv = require("ajv").default;

  const ajvKeywords = require("ajv-keywords").default;

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
  // TODO set `{ keywords: true }` for the next major release and remove `keywords/limit.js`
  addFormats(ajv, { keywords: false });

  // Custom keywords

  const addAbsolutePathKeyword = require("./keywords/absolutePath").default;

  addAbsolutePathKeyword(ajv);

  const addLimitKeyword = require("./keywords/limit").default;

  addLimitKeyword(ajv);

  const addUndefinedAsNullKeyword =
    require("./keywords/undefinedAsNull").default;

  addUndefinedAsNullKeyword(ajv);

  return ajv;
});

/** @typedef {import("json-schema").JSONSchema4} JSONSchema4 */
/** @typedef {import("json-schema").JSONSchema6} JSONSchema6 */
/** @typedef {import("json-schema").JSONSchema7} JSONSchema7 */
/** @typedef {import("ajv").ErrorObject} ErrorObject */

/**
 * @typedef {object} ExtendedSchema
 * @property {(string | number)=} formatMinimum format minimum
 * @property {(string | number)=} formatMaximum format maximum
 * @property {(string | boolean)=} formatExclusiveMinimum format exclusive minimum
 * @property {(string | boolean)=} formatExclusiveMaximum format exclusive maximum
 * @property {string=} link link
 * @property {boolean=} undefinedAsNull undefined will be resolved as null
 */

// TODO remove me in the next major release
/** @typedef {ExtendedSchema} Extend */

/** @typedef {(JSONSchema4 | JSONSchema6 | JSONSchema7) & ExtendedSchema} Schema */

/** @typedef {ErrorObject & { children?: ErrorObject[] }} SchemaUtilErrorObject */

/**
 * @callback PostFormatter
 * @param {string} formattedError
 * @param {SchemaUtilErrorObject} error
 * @returns {string}
 */

/**
 * @typedef {object} ValidationErrorConfiguration
 * @property {string=} name name
 * @property {string=} baseDataPath base data path
 * @property {PostFormatter=} postFormatter post formatter
 */

/**
 * @param {SchemaUtilErrorObject} error error
 * @param {number} idx idx
 * @returns {SchemaUtilErrorObject} error object with idx
 */
function applyPrefix(error, idx) {
  error.instancePath = `[${idx}]${error.instancePath}`;

  if (error.children) {
    for (const err of error.children) applyPrefix(err, idx);
  }

  return error;
}

let skipValidation = false;

// We use `process.env.SKIP_VALIDATION` because you can have multiple `schema-utils` with different version,
// so we want to disable it globally, `process.env` doesn't supported by browsers, so we have the local `skipValidation` variables

// Enable validation
/**
 * @returns {void}
 */
function enableValidation() {
  skipValidation = false;

  // Disable validation for any versions
  if (process && process.env) {
    process.env.SKIP_VALIDATION = "n";
  }
}

// Disable validation
/**
 * @returns {void}
 */
function disableValidation() {
  skipValidation = true;

  if (process && process.env) {
    process.env.SKIP_VALIDATION = "y";
  }
}

// Check if we need to confirm
/**
 * @returns {boolean} true when need validate, otherwise false
 */
function needValidate() {
  if (skipValidation) {
    return false;
  }

  if (process && process.env && process.env.SKIP_VALIDATION) {
    const value = process.env.SKIP_VALIDATION.trim();

    if (/^(?:y|yes|true|1|on)$/i.test(value)) {
      return false;
    }

    if (/^(?:n|no|false|0|off)$/i.test(value)) {
      return true;
    }
  }

  return true;
}

/**
 * A node of the prefix tree used by `filterErrors` to look up already reported errors by their
 * instance path.
 * @typedef {object} ErrorPathNode
 * @property {number[]} indexes positions (in the result array) of the errors reported for exactly this instance path
 * @property {Map<string, ErrorPathNode>} children nodes of nested instance paths, keyed by json pointer segment
 * @property {number} size amount of errors stored in this node and in all its descendants
 */

/**
 * @returns {ErrorPathNode} empty node
 */
function createErrorPathNode() {
  return { indexes: [], children: new Map(), size: 0 };
}

/**
 * Splits an instance path (a json pointer) into its segments, i.e. `"/rules/0"` into `["rules", "0"]`.
 * @param {string} instancePath instance path
 * @returns {string[]} json pointer segments
 */
function parseInstancePath(instancePath) {
  // A json pointer is either empty or starts with a separator, so the leading separator is dropped
  // instead of splitting off an empty first segment
  return instancePath === "" ? [] : instancePath.slice(1).split("/");
}

/**
 * @param {ErrorPathNode} root root node
 * @param {string[]} segments json pointer segments of the error instance path
 * @param {number} index position of the error in the result array
 * @returns {void}
 */
function addErrorPath(root, segments, index) {
  let node = root;

  node.size += 1;

  for (const segment of segments) {
    let child = node.children.get(segment);

    if (!child) {
      child = createErrorPathNode();
      node.children.set(segment, child);
    }

    node = child;
    node.size += 1;
  }

  node.indexes.push(index);
}

/**
 * Removes and returns every error reported for the given instance path or for anything nested
 * inside it, in the order the errors were reported.
 * @param {ErrorPathNode} root root node
 * @param {string[]} segments json pointer segments of the error instance path
 * @returns {number[]} positions (in the result array) of the removed errors
 */
function takeErrorPaths(root, segments) {
  /** @type {ErrorPathNode[]} */
  const ancestors = [root];
  let node = root;

  for (const segment of segments) {
    const child = node.children.get(segment);

    // Nothing was reported below this instance path
    if (!child) {
      return [];
    }

    node = child;
    ancestors.push(node);
  }

  /** @type {number[]} */
  const indexes = [];
  /** @type {ErrorPathNode[]} */
  const stack = [node];

  while (stack.length > 0) {
    const current = /** @type {ErrorPathNode} */ (stack.pop());

    for (const index of current.indexes) {
      indexes.push(index);
    }

    for (const child of current.children.values()) {
      stack.push(child);
    }
  }

  // The whole subtree has been consumed, so detach it and drop the ancestors it left empty,
  // otherwise later lookups would keep walking over nodes without errors
  const removed = indexes.length;

  node.indexes = [];
  node.children.clear();
  node.size = 0;

  for (let i = ancestors.length - 2; i >= 0; i--) {
    ancestors[i].size -= removed;

    if (ancestors[i + 1].size === 0) {
      ancestors[i].children.delete(segments[i]);
    }
  }

  return indexes.sort((a, b) => a - b);
}

/**
 * Nests every error under the last reported error that covers its instance path, so that only the
 * outermost errors are left at the top level.
 * @param {ErrorObject[]} errors array of error objects
 * @returns {SchemaUtilErrorObject[]} filtered array of objects
 */
function filterErrors(errors) {
  /** @type {(SchemaUtilErrorObject | undefined)[]} */
  const newErrors = [];
  const root = createErrorPathNode();

  for (const error of /** @type {SchemaUtilErrorObject[]} */ (errors)) {
    const segments = parseInstancePath(error.instancePath);
    /** @type {SchemaUtilErrorObject[]} */
    let children = [];

    for (const index of takeErrorPaths(root, segments)) {
      const oldError = /** @type {SchemaUtilErrorObject} */ (newErrors[index]);

      newErrors[index] = undefined;

      if (oldError.children) {
        if (children.length === 0) {
          // Adopt the array instead of copying it - a long run of sibling errors re-parents the
          // previously collected children on every step, so copying them would be quadratic
          children = oldError.children;
        } else {
          for (const child of oldError.children) {
            children.push(child);
          }
        }
      }

      oldError.children = undefined;
      children.push(oldError);
    }

    if (children.length) {
      error.children = children;
    }

    addErrorPath(root, segments, newErrors.length);
    newErrors.push(error);
  }

  return /** @type {SchemaUtilErrorObject[]} */ (
    newErrors.filter((error) => typeof error !== "undefined")
  );
}

/**
 * @param {Schema} schema schema
 * @param {object[] | object} options options
 * @returns {SchemaUtilErrorObject[]} array of error objects
 */
function validateObject(schema, options) {
  // Not need to cache, because `ajv@8` has built-in cache
  const compiledSchema = getAjv().compile(schema);
  const valid = compiledSchema(options);

  if (valid) return [];

  return compiledSchema.errors ? filterErrors(compiledSchema.errors) : [];
}

/**
 * @param {Schema} schema schema
 * @param {object[] | object} options options
 * @param {ValidationErrorConfiguration=} configuration configuration
 * @returns {void}
 */
function validate(schema, options, configuration) {
  if (!needValidate()) {
    return;
  }

  let errors = [];

  if (Array.isArray(options)) {
    for (let i = 0; i <= options.length - 1; i++) {
      errors.push(
        ...validateObject(schema, options[i]).map((err) => applyPrefix(err, i)),
      );
    }
  } else {
    errors = validateObject(schema, options);
  }

  if (errors.length > 0) {
    throw new ValidationError(errors, schema, configuration);
  }
}

export { disableValidation, enableValidation, needValidate, validate };
export { default as ValidationError } from "./ValidationError";
