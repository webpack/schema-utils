// The helpers a precompiled check (see `precompile.js`) loads at runtime.
//
// WHY: the generated module requires `schema-utils/dist/runtime` instead of `ajv/dist/runtime/*`
// because the packages shipping a check depend on `schema-utils`, not on `ajv`, which is not
// guaranteed to be resolvable from their files. Every helper is a getter, so a check only loads
// the ones its schema needs.

/* eslint-disable jsdoc/reject-any-type */

/**
 * @typedef {object} Runtime
 * @property {(a: any, b: any) => boolean} equal deep equality for `const`, `enum` and `uniqueItems`
 * @property {(str: string) => number} ucs2length string length in code points for `minLength` and `maxLength`
 * @property {any} uri URI parser for `$ref` to an `$id`
 * @property {Record<string, any>} formats formats of `ajv-formats` for `format`
 */

/** @type {Runtime} */
const runtime = /** @type {any} */ ({});

Object.defineProperties(runtime, {
  equal: {
    enumerable: true,
    get: () => require("ajv/dist/runtime/equal").default,
  },
  ucs2length: {
    enumerable: true,
    get: () => require("ajv/dist/runtime/ucs2length").default,
  },
  uri: {
    enumerable: true,
    get: () => require("ajv/dist/runtime/uri").default,
  },
  formats: {
    enumerable: true,
    get: () => require("ajv-formats/dist/formats").fullFormats,
  },
});

module.exports = runtime;
