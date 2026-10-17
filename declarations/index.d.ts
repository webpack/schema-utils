export type Schema = import("./validate").Schema;
export type JSONSchema4 = import("./validate").JSONSchema4;
export type JSONSchema6 = import("./validate").JSONSchema6;
export type JSONSchema7 = import("./validate").JSONSchema7;
export type ExtendedSchema = import("./validate").ExtendedSchema;
export type ValidationErrorConfiguration =
  import("./validate").ValidationErrorConfiguration;
export type PrecompiledCheck = import("./validate").PrecompiledCheck;
export type PrecompileOptions = import("./precompile").PrecompileOptions;
import { ValidationError } from "./validate";
import { disableValidation } from "./validate";
import { enableValidation } from "./validate";
import { needValidate } from "./validate";
/**
 * @param {Parameters<typeof import("./precompile").default>} args arguments
 * @returns {ReturnType<typeof import("./precompile").default>} source of the module
 */
export function precompile(
  schema: import("./validate").Schema,
  options?: import("./precompile").PrecompileOptions | undefined,
): ReturnType<typeof import("./precompile").default>;
import { validate } from "./validate";
export {
  ValidationError,
  disableValidation,
  enableValidation,
  needValidate,
  validate,
};
