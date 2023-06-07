export default addAbsolutePathKeyword;
export type Ajv = import("ajv").default;
export type SchemaValidateFunction = import("ajv").SchemaValidateFunction;
export type AnySchemaObject = import("ajv").AnySchemaObject;
/** @typedef {import("ajv").default} Ajv */
/** @typedef {import("ajv").SchemaValidateFunction} SchemaValidateFunction */
/** @typedef {import("ajv").AnySchemaObject} AnySchemaObject */
/**
 *
 * @param {Ajv} ajv
 * @returns {Ajv}
 */
declare function addAbsolutePathKeyword(ajv: Ajv): Ajv;
