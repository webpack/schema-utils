export default precompile;
export type PrecompileOptions = {
  /**
   * loads a schema an external `$ref` points to
   */
  loadSchema?: ((uri: string) => Promise<AnySchemaObject>) | undefined;
  /**
   * generate an ES module instead of a CommonJS one
   */
  esm?: boolean | undefined;
  /**
   * drop the error objects a check never reports and minify the code with webpack's minifier, which needs webpack 5.112.0 or later installed
   */
  minify?: boolean | undefined;
};
export type Ajv = import("ajv").default;
export type AnySchemaObject = import("ajv").AnySchemaObject;
export type KeywordCxt = import("ajv").KeywordCxt;
export type Schema = import("./validate").Schema;
export type EXPECTED_ANY = any;
/**
 * @typedef {object} PrecompileOptions
 * @property {((uri: string) => Promise<AnySchemaObject>)=} loadSchema loads a schema an external `$ref` points to
 * @property {boolean=} esm generate an ES module instead of a CommonJS one
 * @property {boolean=} minify drop the error objects a check never reports and minify the code with webpack's minifier, which needs webpack 5.112.0 or later installed
 */
/**
 * Compiles a schema into the source of a module that exports a check for it, CommonJS unless
 * `esm` is set.
 * @param {Schema} schema schema
 * @param {PrecompileOptions=} options options
 * @returns {Promise<string>} source of the module
 */
declare function precompile(
  schema: Schema,
  options?: PrecompileOptions | undefined,
): Promise<string>;
