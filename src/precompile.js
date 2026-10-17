/** @typedef {import("ajv").default} Ajv */
/** @typedef {import("ajv").AnySchemaObject} AnySchemaObject */
/** @typedef {import("ajv").KeywordCxt} KeywordCxt */
/** @typedef {import("./validate").Schema} Schema */

// eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {any} EXPECTED_ANY */

// Compiles a schema into a standalone check, a module exporting `(value) => boolean` that
// `validate` takes as its fourth argument, so a valid value never loads `ajv`.
//
// WHY: compiling a schema with `ajv` at runtime costs about 150ms for the first schema of a process
// (loading `ajv` itself) and a few up to tens of milliseconds for every other one, which every
// webpack plugin and loader pays on every start. The check only answers whether the value is
// valid, the full validation still runs to build the error message when it is not.

const RUNTIME = "schema-utils/dist/runtime";

/**
 * @param {Ajv} ajv ajv
 * @returns {void}
 */
function addKeywords(ajv) {
  const { Name, _ } = require("ajv");

  // The same constructors `ajv-keywords` accepts
  const CONSTRUCTORS = [
    "Object",
    "Array",
    "Function",
    "Number",
    "String",
    "Date",
    "RegExp",
    "Buffer",
    "Promise",
  ];

  ajv.addKeyword({
    keyword: "instanceof",
    schemaType: ["string", "array"],
    /**
     * @param {KeywordCxt} cxt context
     */
    code(cxt) {
      const { data, schema } = cxt;
      const names = Array.isArray(schema) ? schema : [schema];

      for (const name of names) {
        if (!CONSTRUCTORS.includes(name)) {
          throw new Error(`invalid "instanceof" keyword value ${name}`);
        }
      }

      cxt.fail(
        names
          .map((name) => _`!(${data} instanceof ${new Name(name)})`)
          .reduce((a, b) => _`${a} && ${b}`),
      );
    },
  });

  ajv.addKeyword({
    keyword: "absolutePath",
    type: "string",
    schemaType: "boolean",
    /**
     * @param {KeywordCxt} cxt context
     */
    code(cxt) {
      const { data, schema } = cxt;

      // Keep in sync with `keywords/absolutePath.js`
      cxt.fail(
        _`${data}.includes("!") || /^(?:file:(?=\\/))?(?:[A-Za-z]:(\\\\|\\/)|\\\\\\\\|\\/)/i.test(${data}) !== ${schema}`,
      );
    },
  });

  ajv.addKeyword({
    keyword: "undefinedAsNull",
    before: "enum",
    modifying: true,
    /**
     * @param {KeywordCxt} cxt context
     */
    code(cxt) {
      const { gen, data, schema, parentSchema, it } = cxt;

      // Keep in sync with `keywords/undefinedAsNull.js` - the value is set to `null` in its parent
      // the way the full validation sets it, so a passing check leaves the same value behind
      if (
        !schema ||
        typeof parentSchema.enum === "undefined" ||
        it.parentData === undefined ||
        it.parentDataProperty === undefined
      ) {
        return;
      }

      // The value itself has no parent to set when the check is called without one
      const condition =
        it.dataLevel === 0
          ? _`${data} === undefined && ${it.parentData} !== undefined`
          : _`${data} === undefined`;

      gen.if(condition, () => {
        gen.assign(
          _`${/** @type {import("ajv").Name} */ (it.parentData)}[${it.parentDataProperty}]`,
          null,
        );
        gen.assign(data, null);
      });
    },
  });
}

/**
 * @param {string} code generated code
 * @returns {string} code loading the runtime helpers from `schema-utils`
 */
function useRuntime(code) {
  return code.replace(
    /require\("ajv\/dist\/runtime\/(\w+)"\)\.default/g,
    (match, name) => {
      if (!["equal", "ucs2length", "uri"].includes(name)) {
        throw new Error(`Unsupported "ajv" runtime helper "${name}"`);
      }

      return `require(${JSON.stringify(RUNTIME)}).${name}`;
    },
  );
}

// Keywords whose value is a schema, an array of schemas or an object of schemas
const SCHEMA_KEYWORDS = [
  "additionalItems",
  "additionalProperties",
  "contains",
  "else",
  "if",
  "items",
  "not",
  "propertyNames",
  "then",
];
const SCHEMA_ARRAY_KEYWORDS = ["allOf", "anyOf", "items", "oneOf"];
const SCHEMA_MAP_KEYWORDS = [
  "$defs",
  "definitions",
  "dependencies",
  "patternProperties",
  "properties",
];
// Keywords that are not validation keywords but have to stay
const STRUCTURE_KEYWORDS = ["$id", "$schema", "$defs", "definitions"];

/**
 * Removes every keyword that does not validate, i.e. `title`, `description` and `link`.
 *
 * WHY: the generated code embeds the parts of the schema its error objects point to, so the
 * annotations would only make the module bigger and slower to load.
 * @param {EXPECTED_ANY} schema schema
 * @param {Set<string>} keywords validation keywords
 * @returns {EXPECTED_ANY} schema without the annotations
 */
function stripAnnotations(schema, keywords) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return schema;
  }

  /** @type {Record<string, EXPECTED_ANY>} */
  const result = {};

  for (const key of Object.keys(schema)) {
    if (!keywords.has(key)) continue;

    const value = schema[key];

    if (SCHEMA_ARRAY_KEYWORDS.includes(key) && Array.isArray(value)) {
      result[key] = value.map((item) => stripAnnotations(item, keywords));
    } else if (SCHEMA_KEYWORDS.includes(key)) {
      result[key] = stripAnnotations(value, keywords);
    } else if (
      SCHEMA_MAP_KEYWORDS.includes(key) &&
      value &&
      typeof value === "object"
    ) {
      /** @type {Record<string, EXPECTED_ANY>} */
      const map = {};

      for (const name of Object.keys(value)) {
        // A `dependencies` entry is either a schema or an array of property names
        map[name] = Array.isArray(value[name])
          ? value[name]
          : stripAnnotations(value[name], keywords);
      }

      result[key] = map;
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Loads the schema an external `$ref` points to, when it points to a file.
 * @param {string} uri absolute URI of the schema
 * @returns {Promise<AnySchemaObject>} schema
 */
async function loadFileSchema(uri) {
  if (!uri.startsWith("file:")) {
    throw new Error(
      `Cannot load the schema "${uri}", pass a \`loadSchema\` option to load it`,
    );
  }

  const { readFileSync } = require("fs");
  const { fileURLToPath } = require("url");

  return JSON.parse(readFileSync(fileURLToPath(uri), "utf8"));
}

/**
 * @typedef {object} PrecompileOptions
 * @property {((uri: string) => Promise<AnySchemaObject>)=} loadSchema loads a schema an external `$ref` points to
 */

/**
 * Compiles a schema into the source of a CommonJS module that exports a check for it.
 * @param {Schema} schema schema
 * @param {PrecompileOptions=} options options
 * @returns {Promise<string>} source of the module
 */
async function precompile(schema, options = {}) {
  const Ajv = require("ajv").default;
  const standaloneCode = require("ajv/dist/standalone").default;
  const ajvKeywords = require("ajv-keywords").default;
  const addFormats = require("ajv-formats").default;
  const { _ } = require("ajv");

  // The same options as the full validation in `validate.js`, without the ones that only shape
  // the errors - a check only says whether the value is valid
  const ajv = new Ajv({
    strict: false,
    $data: true,
    messages: false,
    code: {
      source: true,
      optimize: true,
      formats: _`require(${RUNTIME}).formats`,
    },
  });

  ajvKeywords(ajv, ["patternRequired"]);
  addFormats(ajv, { keywords: false });

  const addLimitKeyword = require("./keywords/limit").default;

  addLimitKeyword(ajv);
  addKeywords(ajv);

  const keywords = new Set([
    ...Object.keys(ajv.RULES.all),
    ...STRUCTURE_KEYWORDS,
  ]);
  const loadSchema = options.loadSchema || loadFileSchema;
  /** @type {string[]} */
  const loaded = [];

  ajv.opts.loadSchema = async (uri) => {
    loaded.push(uri);

    return stripAnnotations(await loadSchema(uri), keywords);
  };

  const validate = await ajv.compileAsync(stripAnnotations(schema, keywords));

  let code = useRuntime(standaloneCode(ajv, validate));

  // The `$id` of a schema read from a file is its absolute URL, which ends up in the code, so the
  // URLs of the schemas are made relative to the schema for the generated file to be the same on
  // every machine - only those, a value in the schema can be a `file:` URL too
  const { $id } = /** @type {AnySchemaObject} */ (schema);

  if (typeof $id === "string" && $id.startsWith("file:")) {
    const { fileURLToPath } = require("url");
    const path = require("path");

    const dir = path.dirname(fileURLToPath($id));
    const urls = [$id, ...loaded]
      .filter((url) => url.startsWith("file:"))
      // A longer URL first, it can start with a shorter one
      .sort((a, b) => b.length - a.length);

    for (const url of urls) {
      code = code
        .split(url)
        .join(path.relative(dir, fileURLToPath(url)).replace(/\\/g, "/"));
    }
  }

  return `/* eslint-disable */
// @ts-nocheck
/*
 * This file was automatically generated by "schema-utils".
 * DO NOT MODIFY BY HAND.
 */
${code}`;
}

export default precompile;
