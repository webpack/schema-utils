/** @typedef {import("./validate").Schema} Schema */
/** @typedef {import("./validate").JSONSchema4} JSONSchema4 */
/** @typedef {import("./validate").JSONSchema6} JSONSchema6 */
/** @typedef {import("./validate").JSONSchema7} JSONSchema7 */
/** @typedef {import("./validate").ExtendedSchema} ExtendedSchema */
/** @typedef {import("./validate").ValidationErrorConfiguration} ValidationErrorConfiguration */
/** @typedef {import("./validate").PrecompiledCheck} PrecompiledCheck */
/** @typedef {import("./precompile").PrecompileOptions} PrecompileOptions */

const {
  ValidationError,
  disableValidation,
  enableValidation,
  needValidate,
  validate,
} = require("./validate");

/**
 * @param {Parameters<typeof import("./precompile").default>} args arguments
 * @returns {ReturnType<typeof import("./precompile").default>} source of the module
 */
// Loaded on demand, a precompiled schema is generated at build time, never at runtime
const precompile = (...args) => require("./precompile").default(...args);

module.exports = {
  ValidationError,
  disableValidation,
  enableValidation,
  needValidate,
  precompile,
  validate,
};
