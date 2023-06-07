/** @typedef {import("ajv").Ajv} Ajv */
/** @typedef {import("ajv").SchemaValidateFunction} SchemaValidateFunction */
/** @typedef {import("ajv").ValidateFunction} ValidateFunction */

/**
 *
 * @param {Ajv} ajv
 * @returns {Ajv}
 */
function addUndefinedAsNullKeyword(ajv) {
  ajv.addKeyword("undefinedAsNull", {
    modifying: true,
    /** @type {SchemaValidateFunction} */
    validate(
      kwVal,
      data,
      parentSchema,
      dataPath,
      parentData,
      parentDataProperty,
    ) {
      if (kwVal && parentData && typeof parentDataProperty === "number") {
        const idx = /** @type {number} */ (parentDataProperty);
        const parentDataRef = /** @type {any[]} */ (parentData);


        if (typeof parentDataRef[idx] === "undefined") {
          parentDataRef[idx] = null;
        }
      }

      return true;
    },
  });

  return ajv;
}

export default addUndefinedAsNullKeyword;
