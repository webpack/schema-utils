import precompile from "../../src/precompile";

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {any} EXPECTED_ANY */

/** @type {WeakMap<EXPECTED_ANY, Promise<(value: EXPECTED_ANY) => boolean>>} */
const cache = new WeakMap();

/**
 * Loads the generated module the way a package shipping it would, with its runtime helpers from
 * the sources instead of the published `schema-utils`.
 * @param {string} code source of the module
 * @returns {(value: EXPECTED_ANY) => boolean} check
 */
export function load(code) {
  const module = { exports: {} };
  /**
   * @param {string} request request
   * @returns {EXPECTED_ANY} module
   */
  const fakeRequire = (request) => {
    if (request === "schema-utils/dist/runtime") {
      return require("../../src/runtime");
    }

    throw new Error(`The precompiled check requires "${request}"`);
  };

  // eslint-disable-next-line no-new-func
  new Function("module", "exports", "require", code)(
    module,
    module.exports,
    fakeRequire,
  );

  return /** @type {(value: EXPECTED_ANY) => boolean} */ (module.exports);
}

/**
 * @param {EXPECTED_ANY} schema schema
 * @returns {Promise<(value: EXPECTED_ANY) => boolean>} precompiled check of the schema
 */
export function getCheck(schema) {
  let check = cache.get(schema);

  if (!check) {
    check = precompile(schema).then(load);
    cache.set(schema, check);
  }

  return check;
}

/**
 * Copies plain objects and arrays, keeping every other value as is, so a check and the full
 * validation each get their own value to modify.
 * @template T
 * @param {T} value value
 * @returns {T} copy
 */
export function copy(value) {
  if (Array.isArray(value)) {
    return /** @type {T} */ (value.map(copy));
  }

  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    /** @type {Record<string, EXPECTED_ANY>} */
    const result = {};

    for (const key of Object.keys(value)) {
      result[key] = copy(/** @type {EXPECTED_ANY} */ (value)[key]);
    }

    return /** @type {T} */ (result);
  }

  return value;
}
