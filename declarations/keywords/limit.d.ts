export default addLimitKeyword;
export type Ajv = import("ajv").default;
export type Code = import("ajv").Code;
export type Name = import("ajv").Name;
export type KeywordErrorDefinition = import("ajv").KeywordErrorDefinition;
export type KeywordErrorCxt = import("ajv/dist/types").KeywordErrorCxt;
/** @typedef {import("ajv").default} Ajv */
/** @typedef {import("ajv").Code} Code */
/** @typedef {import("ajv").Name} Name */
/** @typedef {import("ajv").KeywordErrorDefinition} KeywordErrorDefinition */
/** @typedef {import("ajv/dist/types").KeywordErrorCxt} KeywordErrorCxt */
/**
 * @param {Ajv} ajv ajv
 * @returns {Ajv} ajv with limit keyword
 */
declare function addLimitKeyword(ajv: Ajv): Ajv;
