/** @typedef {import("ajv").default} Ajv */
/** @typedef {import("ajv").Code} Code */
/** @typedef {import("ajv").Name} Name */
/** @typedef {import("ajv").KeywordErrorDefinition} KeywordErrorDefinition */
/** @typedef {import("ajv/dist/types").KeywordErrorCxt} KeywordErrorCxt */

/**
 * @param {Ajv} ajv ajv
 * @returns {Ajv} ajv with limit keyword
 */
function addLimitKeyword(ajv) {
  const { KeywordCxt, Name, _, nil, str } = require("ajv");

  /**
   * @param {Code | Name} nameOrCode name or code
   * @returns {Code | Name} name or code
   */
  function par(nameOrCode) {
    return nameOrCode instanceof Name ? nameOrCode : _`(${nameOrCode})`;
  }

  /**
   * @param {Code} op op
   * @returns {(xValue: Code, yValue: Code) => Code} code
   */
  function mappend(op) {
    return (xValue, yValue) =>
      xValue === nil
        ? yValue
        : yValue === nil
          ? xValue
          : _`${par(xValue)} ${op} ${par(yValue)}`;
  }

  const orCode = mappend(_`||`);

  // boolean OR (||) expression with the passed arguments
  /**
   * @param {...Code} args args
   * @returns {Code} code
   */
  function or(...args) {
    return args.reduce(orCode);
  }

  /**
   * @param {string | number} key key
   * @returns {Code} property
   */
  function getProperty(key) {
    return _`[${key}]`;
  }

  const keywords = {
    formatMaximum: { okStr: "<=", ok: _`<=`, fail: _`>` },
    formatMinimum: { okStr: ">=", ok: _`>=`, fail: _`<` },
    formatExclusiveMaximum: { okStr: "<", ok: _`<`, fail: _`>=` },
    formatExclusiveMinimum: { okStr: ">", ok: _`>`, fail: _`<=` },
  };

  /**
   * Boolean `formatExclusiveMaximum`/`formatExclusiveMinimum` (v3 style) are
   * flags which make the corresponding `formatMaximum`/`formatMinimum` exclusive.
   * @type {Record<string, "formatMaximum" | "formatMinimum">}
   */
  const exclusiveFlagFor = {
    formatExclusiveMaximum: "formatMaximum",
    formatExclusiveMinimum: "formatMinimum",
  };

  /** @type {Record<string, string>} */
  const inclusiveToExclusive = {
    formatMaximum: "formatExclusiveMaximum",
    formatMinimum: "formatExclusiveMinimum",
  };

  /**
   * @param {KeywordErrorCxt} cxt context
   * @returns {Code | number | string | boolean} limit code
   */
  function getLimitCode({ schemaCode, params }) {
    return params.limit || schemaCode;
  }

  /** @type {KeywordErrorDefinition} */
  const error = {
    message: (cxt) =>
      str`should be ${
        keywords[/** @type {keyof typeof keywords} */ (cxt.keyword)].okStr
      } ${getLimitCode(cxt)}`,
    params: (cxt) =>
      _`{comparison: ${
        keywords[/** @type {keyof typeof keywords} */ (cxt.keyword)].okStr
      }, limit: ${getLimitCode(cxt)}}`,
  };

  for (const keyword of Object.keys(keywords)) {
    ajv.addKeyword({
      keyword,
      type: "string",
      schemaType: keyword.startsWith("formatExclusive")
        ? ["string", "boolean"]
        : ["string", "number"],
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats) return;

        // The inclusive check is performed by the exclusive keyword when it is used as a flag
        if (parentSchema[inclusiveToExclusive[keyword]] === true) {
          return;
        }

        /** @type {Code | number | string | boolean} */
        let schemaCode = cxt.schemaCode; // eslint-disable-line prefer-destructuring
        /** @type {Code | undefined} */
        let limitDefinedCode;

        if (typeof schema === "boolean") {
          const inclusiveKeyword = exclusiveFlagFor[keyword];

          if (
            !schema ||
            typeof parentSchema[inclusiveKeyword] === "undefined"
          ) {
            return;
          }

          const limitCxt = new KeywordCxt(
            it,
            // eslint-disable-next-line jsdoc/reject-any-type
            /** @type {any} */
            (self.RULES.all[inclusiveKeyword]).definition,
            inclusiveKeyword,
          );

          ({ schemaCode } = limitCxt);

          if (limitCxt.$data) {
            limitDefinedCode = _`${schemaCode} === undefined`;
          }

          cxt.setParams({ limit: /** @type {Code} */ (schemaCode) });
        }
        const fCxt = new KeywordCxt(
          it,
          // eslint-disable-next-line jsdoc/reject-any-type
          /** @type {any} */
          (self.RULES.all.format).definition,
          "format",
        );

        /**
         * @param {Name} fmt fmt
         * @returns {Code} code
         */
        function compareCode(fmt) {
          return _`${fmt}.compare(${data}, ${schemaCode}) ${
            keywords[/** @type {keyof typeof keywords} */ (keyword)].fail
          } 0`;
        }

        /**
         * @returns {void}
         */
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats,
          });
          const fmt = gen.const("fmt", _`${fmts}[${fCxt.schemaCode}]`);

          const failCode = or(
            _`typeof ${fmt} != "object"`,
            _`${fmt} instanceof RegExp`,
            _`typeof ${fmt}.compare != "function"`,
            compareCode(fmt),
          );

          cxt.fail$data(
            limitDefinedCode
              ? _`!(${limitDefinedCode}) && (${failCode})`
              : failCode,
          );
        }

        /**
         * @returns {void}
         */
        function validateFormat() {
          const format = fCxt.schema;
          const fmtDef = self.formats[format];

          if (!fmtDef || fmtDef === true) {
            return;
          }

          if (
            typeof fmtDef !== "object" ||
            fmtDef instanceof RegExp ||
            typeof fmtDef.compare !== "function"
          ) {
            throw new Error(
              `"${keyword}": format "${format}" does not define "compare" function`,
            );
          }

          const fmt = gen.scopeValue("formats", {
            key: format,
            ref: fmtDef,
            code: opts.code.formats
              ? _`${opts.code.formats}${getProperty(format)}`
              : undefined,
          });

          cxt.fail$data(
            limitDefinedCode
              ? _`!(${limitDefinedCode}) && (${compareCode(fmt)})`
              : compareCode(fmt),
          );
        }

        if (fCxt.$data) {
          validate$DataFormat();
        } else {
          validateFormat();
        }
      },
      dependencies: ["format"],
    });
  }

  return ajv;
}

export default addLimitKeyword;
